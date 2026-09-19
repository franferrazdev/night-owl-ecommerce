/** @jest-environment node */

import { POST } from "../../../../../app/api/checkout/session/route";
import { prisma } from "@/modules/checkout/infra/database/prisma-client";
import { stripe } from "@/modules/checkout/infra/stripe/stripe-config";

jest.mock("@/modules/checkout/infra/database/prisma-client", () => ({
  prisma: {
    product: {
      findUnique: jest.fn(),
    },
    order: {
      create: jest.fn(),
    },
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
        items: [{ id: "prod-noir-1", externalId: 1, quantity: 1 }],
      }),
      headers: new Headers({
        Origin: "http://localhost:3000",
        "Content-Type": "application/json",
      }),
    } as unknown as Request);

    expect(prisma.product.findUnique).toHaveBeenCalledWith({
      where: { externalId: 1 },
    });

    expect(stripe.checkout.sessions.create).toHaveBeenCalledWith(
      expect.objectContaining({
        payment_method_types: ["card"],
      }),
      expect.objectContaining({ idempotencyKey: expect.any(String) }),
    );

    expect(prisma.order.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          stripeSessionId: "cs_test_123",
          items: {
            create: [
              {
                productId: "demo-product-1",
                quantity: 1,
                price: 129.9,
              },
            ],
          },
        }),
      }),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      url: "https://checkout.stripe.com/test",
    });
  });
});
