import {
  Star,
  Package,
  Truck,
  CheckCircle,
  LucideIcon,
  ShieldCheck,
  MessageSquare,
} from "lucide-react";
import { OrderStatus } from "@/modules/checkout/domain/order-status";

interface StatusStep {
  label: string;
  value: OrderStatus;
  icon: LucideIcon;
}

interface DeliveryStepperProps {
  currentStatus: OrderStatus;
}

export function DeliveryStepper({ currentStatus }: DeliveryStepperProps) {
  const statusSteps: StatusStep[] = [
    { label: "Preparando", value: "PREPARING", icon: Package },
    { label: "Enviado", value: "SHIPPED", icon: Truck },
    { label: "Entregue", value: "DELIVERED", icon: CheckCircle },
    { label: "Recebido", value: "CONFIRMED", icon: ShieldCheck },
    {
      label: "Avaliar",
      value: "REVIEWING",
      icon: MessageSquare,
    },
    { label: "Concluído", value: "REVIEWED", icon: Star },
  ];

  const currentStepIndex = (): number => {
    switch (currentStatus) {
      case "PREPARING":
        return 0;
      case "SHIPPED":
        return 1;
      case "DELIVERED":
        return 2;
      case "CONFIRMED":
        return 3;
      case "REVIEWING":
        return 4;
      case "REVIEWED":
        return 5;
      default:
        return 0;
    }
  };

  const stepIndex = currentStepIndex();

  return (
    /* Interface Visual do Stepper de Entrega */
    <div className="flex flex-col gap-4 my-1 border-t border-b border-slate-100 dark:border-slate-800/60 py-5">
      <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 tracking-widest uppercase text-left pl-1">
        Status da Entrega
      </span>

      <div className="flex items-center justify-between relative px-2">
        {statusSteps.map((step, idx) => {
          const StepIcon = step.icon;
          const isCompleted = idx < stepIndex;
          const isActive = idx === stepIndex;

          return (
            <div
              key={step.value}
              className="flex flex-col items-center gap-2 flex-1 relative z-10"
            >
              {/* Conector Linha de Progresso */}
              {idx > 0 && (
                <div className="absolute top-4 -left-1/2 w-full h-0.5 -z-10 bg-slate-200 dark:bg-slate-800">
                  <div
                    className="h-full bg-emerald-500 transition-all duration-500"
                    style={{
                      width: idx <= stepIndex ? "100%" : "0%",
                    }}
                  />
                </div>
              )}

              {/* Círculo do Ícone */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-300 ${
                  isCompleted || isActive
                    ? "bg-emerald-500/10 border-emerald-500 text-emerald-500"
                    : "bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-600"
                }`}
              >
                <StepIcon
                  size={16}
                  className={isActive ? "animate-pulse" : ""}
                />
              </div>

              {/* Texto do Passo(Step) */}
              <span
                className={`text-[9px] font-bold tracking-tight ${
                  isActive
                    ? "text-slate-800 dark:text-slate-200 font-black"
                    : "text-slate-400 dark:text-slate-500"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
