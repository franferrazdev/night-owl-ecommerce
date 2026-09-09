import { NextResponse } from "next/server";
import { stripe } from "@/infra/stripe/stripe-config";
import { prisma } from "@/infra/database/prisma-client";
import Stripe from "stripe";
import { error } from "next/dist/build/output/log";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      {
        error:
          "Assinatura do Stripe não encontrada nos cabeçalhos da requisição.",
      },
      { status: 400 },
    );
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error(
      "Falha Crítica: Variável de ambiente STRIPE_WEBHOOK_SECRET está ausente.",
    );
    return NextResponse.json(
      { error: "Erro na configuração de segurança do servidor." },
      { status: 500 },
    );
  }

  let event: Stripe.Event;

  try {
    // Validação Criptográfica: Garante que a requisição veio de fato do Stripe e não de um hacker
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    const messageError =
      error instanceof Error ? error.message : "Erro desconhecido";
    console.error(
      `Falha na validação criptográfica do Webhook: ${messageError}`,
    );
    return NextResponse.json(
      { error: `Assinatura inválida do webhook: ${messageError}` },
      { status: 400 },
    );
  }

  // Linha de Defesa Server-Side: Processa apenas se o pagamento foi concluído com sucesso
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      // Busca o pedido inicial pendente mapeado anteriormente no banco
      const existingOrder = await prisma.order.findUnique({
        where: { stripeSessionId: session.id },
        include: { items: true },
      });

      if (!existingOrder) {
        console.error(
          `Falha de Sincronismo: Pedido com a sessão ${session.id} não foi encontrado no banco.`,
        );
        return NextResponse.json(
          {
            error:
              "Sessão de pagamento não correspondente a nenhum pedido ativo.",
          },
          { status: 404 },
        );
      }

      // Trava de Idempotência: Se o pedido já constar como pago por oscilação de rede, ignora o reenvio
      if (existingOrder.status === "PAID") {
        return NextResponse.json({
          received: true,
          message: "Pedido já processado anteriormente.",
        });
      }

      // Atualização Atômica: Marca o pedido como pago e dá baixa automática no estoque físico dos produtos
      await prisma.$transaction(async (tx) => {
        // Atualiza o status do pedido principal para pago (PAID)
        await tx.order.update({
          where: { id: existingOrder.id },
          data: { status: "PAID" },
        });

        // Decrementa o estoque físico real de cada item comprado de forma segura
        for (const orderItem of existingOrder.items) {
          await tx.product.update({
            where: { id: orderItem.productId },
            data: {
              stock: {
                decrement: orderItem.quantity,
              },
            },
          });
        }
      });

      console.log(
        `Sucesso Transacional: Pedido ${existingOrder.id} marcado como pago e estoque atualizado.`,
      );
    } catch (error) {
      console.error(
        "Falha Crítica ao processar a transação atômica do pedido no banco de dados:",
        error,
      );
      return NextResponse.json(
        {
          error: "Erro interno no processamento final da transação financeira.",
        },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({ received: true });
}
