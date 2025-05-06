
import React from "react";
import { usePaymentProcess } from "./usePaymentProcess";
import PaymentFormCard from "./PaymentFormCard";
import QRISPayment from "./QRISPayment";

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
    handlePaymentFormSubmit,
    confirmPayment,
    backToPaymentForm
  } = usePaymentProcess({ items, total, onSuccess });

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
