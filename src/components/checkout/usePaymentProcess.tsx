
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import type { PaymentFormValues } from "./PaymentFormCard";

interface UsePaymentProcessProps {
  items: any[];
  total: number;
  onSuccess: (paymentId: string) => void;
}

export const usePaymentProcess = ({ items, total, onSuccess }: UsePaymentProcessProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState("form"); // form, qris
  const [qrisImage, setQrisImage] = useState("");
  const [paymentId, setPaymentId] = useState("");
  const navigate = useNavigate();

  const handlePaymentFormSubmit = async (values: PaymentFormValues) => {
    setIsProcessing(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Authentication required. Please log in to complete your purchase.");
        navigate("/login");
        return;
      }

      // Call the payment edge function
      const { data, error } = await supabase.functions.invoke("create-payment", {
        body: { items, userId: user.id },
      });

      if (error || !data.success) {
        throw new Error(error?.message || data?.message || "Payment failed");
      }

      // Set the QRIS image and payment ID
      setQrisImage(data.qrisUrl || "https://cdn.worldvectorlogo.com/logos/qris-1.svg"); // Fallback to a generic QRIS logo if no URL provided
      setPaymentId(data.paymentId);
      
      // Show QRIS payment step
      setPaymentStep("qris");
      
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("There was an error processing your payment. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const confirmPayment = () => {
    // In a real implementation, you would check the payment status with the backend
    // For now, we'll simulate a successful payment
    toast.success("Payment verified successfully!");
    onSuccess(paymentId);
  };

  const backToPaymentForm = () => {
    setPaymentStep("form");
  };

  return {
    isProcessing,
    paymentStep,
    qrisImage,
    paymentId,
    handlePaymentFormSubmit,
    confirmPayment,
    backToPaymentForm
  };
};
