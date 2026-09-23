/** @jest-environment node */

import { POST } from "../../../../../app/api/checkout/session/route";
import { prisma } from "@/modules/checkout/infra/database/prisma-client";
import { stripe } from "@/modules/checkout/infra/stripe/stripe-config";

jest.mock("@/modules/checkout/infra/database/prisma-client", () => ({
  prisma: {
    product: {
      findUnique: jest.fn(),
      upsert: jest.fn(),
    },
    order: {
      create: jest.fn(),
    },
    $transaction: jest.fn(),
  },
}));

jest.mock("@/modules/checkout/infra/stripe/stripe-config", () => ({
  stripe: {
    checkout: {
      sessions: {
        create: jest.fn(),
      },
    },
  },
}));

describe("POST /api/checkout", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    (prisma.$transaction as jest.Mock).mockImplementation(async (callback) =>
      callback({
        product: { upsert: prisma.product.upsert },
        order: { create: prisma.order.create },
      }),
    );
  });

  it("uses the demo fallback when the database has no matching product", async () => {
    (prisma.product.findUnique as jest.Mock).mockResolvedValue(null);

    (stripe.checkout.sessions.create as jest.Mock).mockResolvedValue({
      id: "cs_test_123",
      url: "https://checkout.stripe.com/test",
      amount_total: 12990,
    });

    (prisma.order.create as jest.Mock).mockResolvedValue({ id: "order-123" });

    const response = await POST({
      json: async () => ({
        items: [
          {
            id: "prod-noir-1",
            title: "Produto de teste",
            price: 129.9,
            thumbnail: "https://example.com/product.png",
            quantity: 1,
          },
        ],
        email: "test@example.com",
      }),
      headers: new Headers({
        Origin: "http://localhost:3000",
        "Content-Type": "application/json",
      }),
    } as unknown as Request);

    expect(prisma.product.findUnique).toHaveBeenCalledWith({
      where: { id: "prod-noir-1" },
    });

    expect(stripe.checkout.sessions.create).toHaveBeenCalledWith(
      expect.objectContaining({
        payment_method_types: ["card"],
      }),
      expect.objectContaining({ idempotencyKey: expect.any(String) }),
    );

    expect(prisma.product.upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "prod-noir-1" },
      }),
    );

    expect(prisma.order.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          totalAmount: 129.9,
          status: "PENDING",
          userId: "user-sandbox-01",
          items: {
            create: [
              expect.objectContaining({
                productId: "prod-noir-1",
                quantity: 1,
                price: 129.9,
              }),
            ],
          },
        }),
      }),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      url: "https://checkout.stripe.com/test",
      trackingCode: expect.stringMatching(/^BR-\d{6}$/),
    });
  });
});
