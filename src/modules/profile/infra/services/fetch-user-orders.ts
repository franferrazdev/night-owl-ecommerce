"use server";

import { prisma } from "@/modules/checkout/infra/database/prisma-client";
import { OrderStatus } from "@/modules/checkout/domain/order-status";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

export interface PreparedOrderProduct {
  id: string;
  productId: string;
  title: string;
  thumbnail: string;
  quantity: number;
  price: number;
}

export interface PreparedOrder {
  id: string;
  trackingCode: string;
  status: OrderStatus;
  totalAmount: number;
  createdAt: Date;
  items: PreparedOrderProduct[];
}

type OrderWithItemsPayload = Prisma.OrderGetPayload<{
  include: { items: true };
}>;

/** Server Action que busca o histórico completo de pedidos faturados de um usuário.
 * @param userId Identificador único do cliente na sessão */
export async function fetchUserOrders(
  userId: string,
): Promise<PreparedOrder[]> {
  if (!userId) {
    return [];
  }

  try {
    const orders = await prisma.order.findMany({
      where: {
        userId: userId,
      },
      include: {
        items: true, // Inclui automaticamente a tabela pivot order_items vinculada
      },
      orderBy: {
        createdAt: "desc", // Ordena dos pedidos mais recentes para os mais antigos
      },
    });

    // Purga o cache da rota de perfil garantindo dados frescos do Supabase a cada chamada
    revalidatePath("/profile");

    // Mapeamento explícito para garantir conformidade estrita com o tipo de domínio OrderStatus
    return (orders as OrderWithItemsPayload[]).map(
      (order: OrderWithItemsPayload) => ({
        id: order.id,
        trackingCode: order.trackingCode,
        status: order.status as OrderStatus,
        totalAmount: order.totalAmount,
        createdAt: order.createdAt,
        items: order.items.map((item) => ({
          id: item.id,
          productId: item.productId,
          title: item.title,
          thumbnail: item.thumbnail,
          quantity: item.quantity,
          price: item.price,
        })),
      }),
    );
  } catch (error) {
    console.error("Erro crítico ao ler histórico do Prisma:", error);
    return [];
  }
}
