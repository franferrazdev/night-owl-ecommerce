export type OrderStatus =
  | "PENDING"
  | "PAID"
  | "FAILED"
  | "PREPARING"
  | "SHIPPED"
  | "DELIVERED"
  | "CONFIRMED"
  | "REVIEWING"
  | "REVIEWED";

export interface TrackingStep {
  status: OrderStatus;
  label: string;
  description: string;
  isCompleted: boolean;
  isActive: boolean;
}
