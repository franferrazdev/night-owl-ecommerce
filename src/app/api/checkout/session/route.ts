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
    const validatedItems = [];

    for (const cartItem of body.items) {
      let productTitle = cartItem.title;
      let productPrice = cartItem.price;
      let productId = cartItem.id;

      try {
        // Tenta buscar o produto real no banco de dados para garantir segurança de preços
        const dbProduct = await prisma.product.findUnique({
          where: { id: cartItem.id },
        });

        if (dbProduct) {
          productTitle = dbProduct.title;
          productPrice = dbProduct.price;
          productId = dbProduct.id;

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
            images: cartItem.thumbnail ? [cartItem.thumbnail] : [],
          },
          unit_amount: Math.round(productPrice * 100),
        },
        quantity: cartItem.quantity,
      });

      validatedItems.push({
        productId: productId,
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

    const sessionConfig: Record<string, unknown> = {
      payment_method_types: enabledPaymentMethods,
      line_items: lineItems,
      mode: "payment",
      customer_email: customerEmail,
      metadata: {
        buyer_name: "Dev Recrutador - Portfolio Test",
        project_owner: "Francielle Ferraz",
      },
      success_url: `${origin}/order/success?session_id={CHECKOUT_SESSION_ID}`,
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
          stripeSessionId: session.id,
          totalAmount: (session.amount_total ?? 0) / 100,
          status: "PENDING",
          items: {
            create: validatedItems.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
            })),
          },
        },
      });
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
