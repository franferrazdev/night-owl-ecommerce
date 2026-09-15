export interface ProductReview {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}

export interface CatalogProduct {
  id: string; // UUID interno gerado pelo ecossistema
  externalId: number; // ID original numérico que vem da API do DummyJSON
  title: string;
  description: string;
  price: number;
  stock: number;
  thumbnail: string; // URL da imagem oficial do produto para renderização visual
  category: string;
  rating?: number; // Metadados de nota média
  reviews?: ProductReview[]; // Array estrito de comentários reais
}

export interface DummyJSONProductResponse {
  id: number;
  title: string;
  description: string;
  price: number;
  stock: number;
  thumbnail: string;
  category: string;
  rating?: number;
  reviews?: ProductReview[];
}

export interface DummyJSONCatalogResponse {
  products: DummyJSONProductResponse[];
  total: number;
  skip: number;
  limit: number;
}
