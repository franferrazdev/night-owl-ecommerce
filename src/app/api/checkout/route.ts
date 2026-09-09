import { NextResponse } from "next/server";
import { stripe } from "@/infra/stripe/stripe-config";
import { prisma } from "@/infra/database/prisma-client";
import { error } from "next/dist/build/output/log";
import next from "next/dist/types";

interface CheckoutRequestBody {
  items: {
    id: string;
    quantity: number;
  }[];
}

export async function POST(request: Request) {
  try {
    const body: CheckoutRequestBody = await request.json();

    if (!body.items || body.items.length === 0) {
      return NextResponse.json(
        { error: "O carrinho está vazio ou possui uma estrutura inválida." },
        { status: 400 },
      );
    }

    // Linha de Defesa Server-Side: Validação Rígida de Preços e Estoque contra Fraudes
    const lineItems = [];
    const productsToUpdate = [];

    for (const cartItem of body.items) {
      // Busca o produto real direto no banco via Prisma para pegar o preço verdadeiro
      const dbProduct = await prisma.product.findUnique({
        where: { id: cartItem.id },
      });

      if (!dbProduct) {
        return NextResponse.json(
          { error: `Produto com o ID ${cartItem.id} não foi encontrado.` },
          { status: 404 },
        );
      }

      // Valida se há estoque disponível no servidor antes de mandar para o Stripe
      if (dbProduct.stock < cartItem.quantity) {
        return NextResponse.json(
          { error: `Estoque insuficiente para o produto: ${dbProduct.title}` },
          { status: 400 },
        );
      }

      // Monta o item no formato exato que o Stripe exige
      lineItems.push({
        price_data: {
          currency: "brl",
          product_data: {
            name: dbProduct.title,
          },
          unit_amount: Math.round(dbProduct.price * 100),
        },
        quantity: cartItem.quantity,
      });
    }

    // Gerador de Chave de Idempotência baseada no timestamp para travar cliques repetidos
    const idempotencyKey = `idemp_cart_${Date.now()}`;

    // Dispara a criação da sessão segura de pagamento no Stripe
    const session = await stripe.checkout.sessions.create(
      {
        payment_method_types: ["card", "pix"],
        payment_method_options: {
          pix: {
            expires_after_seconds: 3600,
          },
        },
        line_items: lineItems,
        mode: "payment",
        success_url: `${request.headers.get("origin")}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${request.headers.get("origin")}/cart`,
      },
      {
        idempotencyKey: idempotencyKey,
      },
    );

    // Cria o pedido inicial no banco marcado como PENDING antes de ir para a tela de pagamento
    await prisma.order.create({
      data: {
        stripeSessionId: session.id,
        totalAmount: (session.amount_total ?? 0) / 100,
        status: "PENDING",
        items: {
          create: body.items.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
          })),
        },
      },
    });

    // Retorna a URL segura do Stripe para onde o Next.js vai redirecionar o cliente
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Falha Crítica no Proxy de Sessão de Checkout:", error);
    return NextResponse.json(
      { error: "Erro Interno do Servidor no processamento do checkout." },
      { status: 500 },
    );
  }
}
