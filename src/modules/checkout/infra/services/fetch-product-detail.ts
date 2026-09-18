import {
  CatalogProduct,
  DummyJSONProductResponse,
} from "@/modules/checkout/domain/entities/catalog-product";

/** Serviço Server-Side: Consome os dados detalhados de um produto específico direto da API pública do DummyJSON utilizando o ID correspondente. */
export async function fetchProductDetail(
  productId: string,
): Promise<CatalogProduct | null> {
  try {
    // Extrai o ID numérico original removendo o prefixo de domínio
    const cleanId = productId.replace("prod-noir-", "");

    const response = await fetch(`https://dummyjson.com/products/${cleanId}`, {
      method: "GET",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "X-Requested-With": "XMLHttpRequest",
      },
    });

    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(
        `A API externa retornou uma falha HTTP com status: ${response.status}`,
      );
    }

    const prod: DummyJSONProductResponse = await response.json();

    if (!prod) return null;

    // Transforma os dados crus capturados no formato do contrato do e-commerce
    return {
      id: `prod-noir-${prod.id}`,
      externalId: prod.id,
      title: prod.title,
      description: prod.description,
      price: prod.price,
      stock: prod.stock,
      thumbnail: prod.thumbnail,
      category: prod.category,
      rating: prod.rating,
      discountPercentage: prod.discountPercentage || 0,
      reviews: prod.reviews || [],
    };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Erro desconhecido";
    console.log(
      `Falha Crítica ao recuperar detalhes do produto ${productId}: ${message}`,
    );
    throw new Error(
      `Não foi possível carregar as especificações do produto: ${message}`,
    );
  }
}
