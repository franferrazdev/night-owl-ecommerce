"use server";

import { prisma } from "@/modules/checkout/infra/database/prisma-client";
import { OrderStatus } from "@/modules/checkout/domain/order-status";

export interface CheckoutItemInput {
  id: string;
  title: string;
  thumbnail: string;
  price: number;
  quantity: number;
}

export interface CreateOrderInput {
  userId: string;
  trackingCode: string; // O código BR-XXXXXX gerado na interface
  totalAmount: number;
  items: CheckoutItemInput[];
}

/** Sserver Action que persiste fisicamente o pedido e seus itens vinculados no banco de dados.
 * @param input Dados estruturados do faturamento do checkout
 */
export async function createOrder(
  input: CreateOrderInput,
): Promise<{ success: boolean; orderId?: string; error?: string }> {
  //   Validações de segurança estritas
  if (!input.userId || !input.trackingCode || input.items.length === 0) {
    return {
      success: false,
      error: "Dados de checkout inválidos ou carrinho vazio.",
    };
  }
  try {
    // Executa a criação de forma transacional e atômica no banco de dados
    const result = await prisma.$transaction(async (tx) => {
      // Garante a existência do usuário Sandbox no banco
      await tx.user.upsert({
        where: { id: input.userId },
        update: {}, // Não faz nada se o usuário sandbox já existir
        create: {
          id: input.userId,
          email: "sandbox@nightowl.com",
          name: "Recrutador",
        },
      });
      // Faz o upsert de cada produto do carrinho antes de criar os itens do pedido
      for (const item of input.items) {
        await tx.product.upsert({
          where: { id: item.id },
          update: {
            title: item.title,
            price: item.price,
            thumbnail: item.thumbnail,
          },
          create: {
            id: item.id,
            externalId: Math.floor(100000 + Math.random() * 900000),
            title: item.title,
            price: item.price,
            stock: 99, // Falback para sandbox
            thumbnail: item.thumbnail,
          },
        });
      }
      // Cria o registro principal do pedido na tabela 'orders'
      const newOrder = await tx.order.create({
        data: {
          trackingCode: input.trackingCode,
          status: "PREPARING" as OrderStatus, // Inicia na primeira etapa da máquina de estados
          totalAmount: input.totalAmount,
          userId: input.userId,
        },
      });

      // Mapeia e cria todos os itens vinculados na tabela 'order_items'
      const orderItemsData = input.items.map((item) => ({
        orderId: newOrder.id,
        productId: item.id,
        title: item.title,
        thumbnail: item.thumbnail,
        price: item.price,
        quantity: item.quantity,
      }));

      await tx.orderItem.createMany({
        data: orderItemsData,
      });

      return newOrder;
    });

    return { success: true, orderId: result.id };
  } catch (error) {
    console.error(
      "Erro crítico transacional ao salvar pedido no Prisma:",
      error,
    );
    return {
      success: false,
      error: "Falha interna ao processar o faturamento no banco de dados.",
    };
  }
}
