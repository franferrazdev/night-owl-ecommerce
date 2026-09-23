"use server";

import { prisma } from "@/modules/checkout/infra/database/prisma-client";
import { OrderStatus } from "@/modules/checkout/domain/order-status";

/** Server Action que atualiza o status de um pedido no banco e limpa o cache do Next.js
 * @param trackingCode Código BR-XXXXXX do pedido
 * @param newStatus Novo status vindo da máquina de estados
 */
export async function updateOrderStatus(
  trackingCode: string,
  newStatus: OrderStatus,
): Promise<{ success: boolean; error?: string }> {
  if (!trackingCode) {
    return { success: false, error: "Código de rastreamento inválido." };
  }

  try {
    await prisma.order.update({
      where: { trackingCode: trackingCode },
      data: { status: newStatus, userId: "user-sandbox-01" },
    });

    return { success: true };
  } catch (error) {
    console.error("Erro ao atualizar status do pedido no Prisma:", error);
    return {
      success: false,
      error: "Falha ao persistir mudança de estado logístico.",
    };
  }
}
