import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProductCard } from "../product-card";
import { CatalogProduct } from "@/modules/checkout/domain/entities/catalog-product";

// Mock isolado das Stores do Zustand para o teste não quebrar no terminal
const mockAddItem = jest.fn();
const mockToggleCart = jest.fn();
const mockToggleFavorite = jest.fn();

jest.mock("@/modules/checkout/presentation/store/cart-store", () => ({
  useCartStore: () => ({
    addItem: mockAddItem,
    toggleCart: mockToggleCart,
  }),
}));

jest.mock("@/modules/checkout/presentation/store/wishlist-store", () => ({
  useWishlistStore: () => ({
    toggleFavorite: mockToggleFavorite,
    favoriteIds: [],
  }),
}));

// Mock do componente Toast para evitar disparos físicos em tela no ambiente virtual
jest.mock("react-hot-toast", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Produto Mock de teste
const mockProduct: CatalogProduct = {
  id: "prod-noir-1",
  externalId: 1,
  title: "Jaqueta de Couro Midnight",
  description: "Jaqueta premium texturizada impermeável com acabamento fosco.",
  price: 450.0,
  stock: 10,
  thumbnail: "https://dummyjson.com/products",
  category: "mens-shirts",
};

describe("Componente: ProductCard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve renderizar as especificações centrais do produto na tela com sucesso", () => {
    render(<ProductCard product={mockProduct} />);

    // Valida se o título e a descrição estão visíveis no documento virtual HTML
    expect(screen.getByText("Jaqueta de Couro Midnight")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Jaqueta premium texturizada impermeável com acabamento fosco.",
      ),
    ).toBeInTheDocument();

    // Valida se a formatação monetária em Real (BRL) foi renderizada corretamente
    expect(screen.getByText("R$ 450.00")).toBeInTheDocument();
    expect(screen.getByText("Estoque: 10")).toBeInTheDocument();
  });

  it("deve disparar a injeção na store e abrir o carrinho ao clicar no botão de compra", async () => {
    render(<ProductCard product={mockProduct} />);

    const buyButton = screen.getByRole("button", {
      name: /adicionar ao carrinho/i,
    });

    // Simula o clique físico do mouse do usuário de forma assíncrona
    await userEvent.click(buyButton);

    // Asserções: Garante que as funções da store foram chamadas com os parâmetros exatos
    expect(mockAddItem).toHaveBeenCalledTimes(1);
    expect(mockAddItem).toHaveBeenCalledWith({
      id: mockProduct.id,
      externalId: mockProduct.externalId,
      title: mockProduct.title,
      price: mockProduct.price,
      stock: mockProduct.stock,
      thumbnail: mockProduct.thumbnail,
    });
    expect(mockToggleCart).toHaveBeenCalledTimes(1);
  });

  it("deve renderizar a tag de esgotado e desabilitar o botão se o estoque for zero", () => {
    const soldOutProduct = { ...mockProduct, stock: 0 };
    render(<ProductCard product={soldOutProduct} />);

    expect(screen.getByText("Esgotado")).toBeInTheDocument();

    const buyButton = screen.getByRole("button", {
      name: /adicionar ao carrinho/i,
    });
    expect(buyButton).toBeDisabled();
  });
});
