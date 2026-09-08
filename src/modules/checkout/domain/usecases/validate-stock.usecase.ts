import {
  CartItem,
  validateItemQuantity,
} from "@/modules/checkout/domain/entities/cart-item";

export interface ValidateStockInput {
  currentItems: CartItem[];
  productId: string;
  targetQuantity: number;
  stockAvailable: number;
}

/** Caso de Uso: Valida e atualiza a quantidade de um item no carrinho respeitando as travas de segurança do domínio. */
export function validateStockUsecase(input: ValidateStockInput): CartItem[] {
  return input.currentItems.map((item) => {
    if (item.id === input.productId) {
      const safeQuantity = validateItemQuantity(
        input.targetQuantity,
        input.stockAvailable,
      );
      return { ...item, quantity: safeQuantity };
    }
    return item;
  });
}
