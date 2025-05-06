
import React from "react";
import { usePaymentProcess } from "./usePaymentProcess";
import PaymentFormCard from "./PaymentFormCard";
import QRISPayment from "./QRISPayment";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface PaymentFormProps {
  items: any[];
  total: number;
  onSuccess: (paymentId: string) => void;
}

const PaymentForm = ({ items, total, onSuccess }: PaymentFormProps) => {
  const {
    isProcessing,
    paymentStep,
    qrisImage,
    paymentId,
    error,
    handlePaymentFormSubmit,
    confirmPayment,
    backToPaymentForm
  } = usePaymentProcess({ items, total, onSuccess });

  if (error) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (paymentStep === "qris") {
    return (
      <QRISPayment
        qrisImage={qrisImage}
        paymentId={paymentId}
        total={total}
        onConfirmPayment={confirmPayment}
        onBackToForm={backToPaymentForm}
      />
    );
  }

  return (
    <PaymentFormCard
      total={total}
      isProcessing={isProcessing}
      onSubmit={handlePaymentFormSubmit}
    />
  );
};

export default PaymentForm;
