export interface CatalogProduct {
  id: string; // UUID interno gerado pelo ecossistema
  externalId: number; // ID original numérico que vem da API do DummyJSON
  title: string;
  description: string;
  price: number;
  stock: number;
  thumbnail: string; // URL da imagem oficial do produto para renderização visual
}

export interface DummyJSONProductResponse {
  id: number;
  title: string;
  description: string;
  price: number;
  stock: number;
  thumbnail: string;
}

export interface DummyJSONCatalogResponse {
  products: DummyJSONProductResponse[];
  total: number;
  skip: number;
  limit: number;
}
