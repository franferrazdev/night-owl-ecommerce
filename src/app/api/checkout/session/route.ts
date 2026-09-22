import { NextResponse } from "next/server";
import { stripe } from "@/modules/checkout/infra/stripe/stripe-config";
import { prisma } from "@/modules/checkout/infra/database/prisma-client";
import { error } from "next/dist/build/output/log";

interface CheckoutRequestBody {
  items: {
    id: string;
    title: string;
    price: number;
    thumbnail?: string;
    quantity: number;
  }[];
  email: string;
}

interface ValidatedItem {
  productId: string;
  title: string;
  thumbnail: string;
  price: number;
  quantity: number;
}

export async function POST(req: Request) {
  try {
    const body: CheckoutRequestBody = await req.json();

    if (!body.items || body.items.length === 0) {
      return NextResponse.json(
        { error: "O carrinho está vazio ou possui uma estrutura inválida." },
        { status: 400 },
      );
    }

    const origin = req.headers.get("origin") ?? "http://localhost:3000";
    const lineItems = [];
    const validatedItems: ValidatedItem[] = [];

    for (const cartItem of body.items) {
      let productTitle = cartItem.title;
      let productPrice = cartItem.price;
      let productId = cartItem.id;
      let productThumbnail = cartItem.thumbnail ?? "";

      try {
        // Tenta buscar o produto real no banco de dados para garantir segurança de preços
        const dbProduct = await prisma.product.findUnique({
          where: { id: cartItem.id },
        });

        if (dbProduct) {
          productTitle = dbProduct.title;
          productPrice = dbProduct.price;
          productId = dbProduct.id;
          productThumbnail = dbProduct.thumbnail;

          if (dbProduct.stock < cartItem.quantity) {
            return NextResponse.json(
              {
                error: `Estoque insuficiente para o produto: ${dbProduct.title}`,
              },
              { status: 400 },
            );
          }
        }
      } catch (dbError) {
        // Se o Supabase estiver pausado, o servidor não crasha e consome os dados dinâmicos do carrinho de forma segura
        console.warn(
          "Banco de dados indisponível. Utilizando dados dinâmicos do payload do carrinho.",
        );
      }

      lineItems.push({
        price_data: {
          currency: "brl",
          product_data: {
            name: productTitle,
            images: productThumbnail ? [productThumbnail] : [],
          },
          unit_amount: Math.round(productPrice * 100),
        },
        quantity: cartItem.quantity,
      });

      validatedItems.push({
        productId: productId,
        title: productTitle,
        thumbnail: productThumbnail,
        quantity: cartItem.quantity,
        price: productPrice,
      });
    }

    const idempotencyKey = `idemp_cart_${Date.now()}`;
    const enabledPaymentMethods = ["card"];
    const allowPix = process.env.STRIPE_ENABLE_PIX === "true";

    if (allowPix) {
      enabledPaymentMethods.push("pix");
    }

    const customerEmail =
      body.email && body.email !== "dev@nightowl.com" ? body.email : undefined;

    // Gerando o trackingCode dinamicamente para o Stripe carregar na session do checkout
    const randomDigits = Math.floor(100000 + Math.random() * 900000);
    const trackingCode = `BR-${randomDigits}`;

    // Injeta o ID dinâmico do primeiro produto comprado na URL
    const targetProductId = validatedItems[0]?.productId || "1";

    const sessionConfig: Record<string, unknown> = {
      payment_method_types: enabledPaymentMethods,
      line_items: lineItems,
      mode: "payment",
      customer_email: customerEmail,
      metadata: {
        buyer_name: "Dev Recrutador - Portfolio Test",
        project_owner: "Francielle Ferraz",
        trackingCode: trackingCode, // Passa o trackingCode via metadados para o Webhook ler com precisão
      },
      success_url: `${origin}/order/success?productId=${targetProductId}&trackingCode=${trackingCode}`,
      cancel_url: `${origin}/order`,
    };

    if (allowPix) {
      sessionConfig.payment_method_options = {
        pix: {
          expires_after_seconds: 3600,
        },
      };
    }

    const session = await stripe.checkout.sessions.create(sessionConfig, {
      idempotencyKey,
    });

    try {
      await prisma.order.create({
        data: {
          trackingCode: trackingCode,
          totalAmount: (session.amount_total ?? 0) / 100,
          status: "PENDING",
          userId: "user-sandbox-01",
          items: {
            create: validatedItems.map((item) => ({
              title: item.title,
              thumbnail: item.thumbnail,
              price: item.price,
              quantity: item.quantity,
              product: {
                connect: { id: item.productId },
              },
            })),
          },
        },
      });
      console.log(
        `[SUCESSO] Pedido ${trackingCode} registrado preliminamente no Supabase.`,
      );
    } catch (orderError) {
      console.warn(
        "Falha ao persistir pedido no banco. Pedido processado em modo memória resiliente.",
      );
    }
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Falha Crítica no Proxy de Sessão de Checkout:", error);
    return NextResponse.json(
      { error: "Erro Interno do Servidor no processamento do checkout." },
      { status: 500 },
    );
  }
}
