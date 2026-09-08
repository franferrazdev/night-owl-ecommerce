export interface CartItem {
  id: string; // ID único interno (UUID)
  externalId: number; // ID original que vem da API do DummyJSON
  title: string;
  price: number;
  quantity: number;
  stock: number; // Extoque máximo disponível retornado pela API
}

/** Calcula o valor subtotal de um item multiplicando o preço pela quantidade. */
export function calculateItemSubtotal(item: CartItem): number {
  return item.price * item.quantity;
}

/** Valida se a quantidade solicitada respeita os limites físicos de estoque e as regras de negócio de compra máxima (ex.: limite de 10 unidades por cliente). */
export function validateItemQuantity(
  requestedQuantity: number,
  stockAvailable: number,
): number {
  const MAX_LIMIT_PER_CUSTOMER = 10;

  if (requestedQuantity <= 0) return 1;

  // Limita primeiro pelo estoque fśico real do produto
  if (requestedQuantity > stockAvailable) {
    return stockAvailable;
  }

  // Limita pela regra de negócio anti-abuso de estoque
  if (requestedQuantity > MAX_LIMIT_PER_CUSTOMER) {
    return MAX_LIMIT_PER_CUSTOMER;
  }

  return requestedQuantity;
}
