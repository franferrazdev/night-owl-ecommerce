import "@testing-library/jest-dom";

import { render, screen, fireEvent } from "@testing-library/react";
import { CartDrawer } from "@/modules/checkout/presentation/components/cart-drawer";
import { useCartStore } from "@/modules/checkout/presentation/store/cart-store";

// Realiza o mock isolado do Zustand para controlar o estado do carrinho nos testes
jest.mock("@/modules/checkout/presentation/store/cart-store");

const useCartStoreMock = useCartStore as jest.MockedFunction<
  typeof useCartStore
>;

describe("Componente Unitário: CartDrawer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Deve renderizar a mensagem de carrinho vazio quando não houver produtos selecionados", () => {
    // Configura o estado simulado do Zustand para carrinho vazio e aberto
    useCartStoreMock.mockReturnValue({
      items: [],
      isOpen: true,
      toggleCart: jest.fn(),
      getTotalAmount: () => 0,
      clearCart: jest.fn(),
      addItem: jest.fn(),
      removeItem: jest.fn(),
      updateQuantity: jest.fn(),
      getTotalItemsAmount: () => 0,
    });

    render(<CartDrawer />);

    // Asserção: Verifica se o texto mapeado na sprint anterior está na tela
    expect(screen.getByText("Seu carrinho está vazio.")).toBeInTheDocument();
  });

  test("Deve exibir a lista de itens com o cálculo correto do valor total transacional", () => {
    const itemSimulator = {
      id: "prod-owl-test",
      externalId: 999,
      title: "Casaco Premium Midnight Noir",
      price: 150.0,
      quantity: 2,
      stock: 5,
    };

    useCartStoreMock.mockReturnValue({
      items: [itemSimulator],
      isOpen: true,
      toggleCart: jest.fn(),
      getTotalAmount: () => 300.0, // 150.0 * 2 unidades
      clearCart: jest.fn(),
      addItem: jest.fn(),
      removeItem: jest.fn(),
      updateQuantity: jest.fn(),
      getTotalItemsCount: () => 2,
    });

    render(<CartDrawer />);

    // Asserções: valida a renderização do título do item e o valor total acumulado em Real
    expect(
      screen.getByText("Casaco Premium Midnight Noir"),
    ).toBeInTheDocument();
    expect(screen.getByText("R$R$300.00")).toBeInTheDocument();
  });

  test("Deve disparar a função de atualizar quantidade ao clicar no botão de incremento", () => {
    const itemSimulator = {
      id: "prod-owl-test",
      externalId: 999,
      title: "Casaco Premium Midnight Noir",
      price: 150.0,
      quantity: 1,
      stock: 5,
    };

    const fnUpdateQuantity = jest.fn();

    useCartStoreMock.mockReturnValue({
      items: [itemSimulator],
      isOpen: true,
      tofflwCart: jest.fn(),
      getTotalAmount: () => 150.0,
      clearCart: jest.fn,
      addItem: jest.fn,
      removeItem: jest.fn,
      updateQuantity: fnUpdateQuantity,
      getTotalItemsCount: () => 1,
    });

    render(<CartDrawer />);

    // Simula o evento de clique no botão de incremento do produto
    const bottomIncrement = screen.getByLabelText("Incrementar quantidade");
    fireEvent.click(bottomIncrement);

    // Asserção: Garante que o clique chamou a store para aumentar a quantidade respeitando as travas de estoque
    expect(fnUpdateQuantity).toHaveBeenCalledWith("prod-owl-test", 2, 5);
  });
});
