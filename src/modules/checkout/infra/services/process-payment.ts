interface PaymentRequest {
  email: string;
  itemsCount: number;
  totalAmount: number;
}

interface PaymentResponse {
  success: boolean;
  orderId: string;
  transactionTimestamp: string;
}

/** Serviço Transacional: Simula o processamento assíncrono de pagamento na esteira do gateway simulado */
export async function processPayment(
  request: PaymentRequest,
): Promise<PaymentResponse> {
  // Emula o atraso físico de rede e processamento da maquininha de cartão/PIX
  await new Promise((resolve) => setTimeout(resolve, 1500));

  if (request.itemsCount <= 0 || request.totalAmount <= 0) {
    return {
      success: false,
      orderId: "",
      transactionTimestamp: new Date().toISOString(),
    };
  }

  // Gera um número identificador de pedido único baseado em sorteio matemático estável
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const generatedOrderId = `owl-order-${randomSuffix}`;

  return {
    success: true,
    orderId: generatedOrderId,
    transactionTimestamp: new Date().toISOString(),
  };
}
