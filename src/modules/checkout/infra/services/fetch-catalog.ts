import {
  CatalogProduct,
  DummyJSONCatalogResponse,
} from "@/modules/checkout/domain/entities/catalog-product";

/** Serviço Server-Side: Consome a API pública de produtos com tratamento defensivo contra bloqueios de rede ou loops de roteamento local do Next.js */
export async function fetchCatalogProducts(): Promise<CatalogProduct[]> {
  try {
    const response = await fetch("https://dummyjson.com/products", {
      method: "GET",
      cache: "no-store",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "X-Requested-With": "XMLHttpRequest",
      },
    });

    if (!response.ok) {
      throw new Error(
        `A API do DummyJSON retornou o status HTTP ${response.status}`,
      );
    }

    const data: DummyJSONCatalogResponse = await response.json();

    if (!data || !data.products) {
      throw new Error(
        "A resposta recebida da API não contém produtos válidos.",
      );
    }

    // Mapeia os dados em tempo real para o contrato do e-commerce
    return data.products.map((prod) => ({
      id: `prod-noir-${prod.id}`, // Mock temporáreo de string compatível com o carrinho
      externalId: prod.id,
      title: prod.title,
      description: prod.description,
      price: prod.price,
      stock: prod.stock,
      thumbnail: prod.thumbnail,
    }));
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Erro desconhecido";
    console.error(`Falha Critica ao buscar produtos do catalogo: ${message}`);

    throw new Error(
      `Nao foi possivel carregar o catalogo de produtos: ${message}`,
    );
  }
}
