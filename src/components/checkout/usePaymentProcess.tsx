
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type PaymentStep = "form" | "qris";

interface PaymentProcessProps {
  items: any[];
  total: number;
  onSuccess: (paymentId: string) => void;
}

export function usePaymentProcess({ items, total, onSuccess }: PaymentProcessProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState<PaymentStep>("form");
  const [qrisImage, setQrisImage] = useState<string>("");
  const [paymentId, setPaymentId] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  // Process payment form submission
  const handlePaymentFormSubmit = async () => {
    try {
      setError(null);
      setIsProcessing(true);

      // Get current user
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        throw new Error("You must be logged in to make a payment");
      }
      
      // Create payment via edge function
      const { data: paymentData, error: paymentError } = await supabase.functions.invoke("create-payment", {
        body: {
          items,
          userId: session.user.id
        }
      });

      if (paymentError) {
        throw new Error(`Payment error: ${paymentError.message}`);
      }

      if (!paymentData.success) {
        throw new Error(paymentData.message || "Failed to process payment");
      }

      // Set payment data
      setPaymentId(paymentData.paymentId);
      setQrisImage(paymentData.qrisUrl);
      setPaymentStep("qris");
      toast.success("QRIS payment code generated");

    } catch (err: any) {
      console.error("Payment error:", err);
      setError(err.message || "Failed to process payment");
      toast.error(err.message || "Failed to process payment");
    } finally {
      setIsProcessing(false);
    }
  };

  // Confirm payment after QRIS scan
  const confirmPayment = async () => {
    try {
      setError(null);
      setIsProcessing(true);

      // In a real system, you'd verify payment status with the payment provider
      
      // Pass the payment ID to the success handler - let the parent component
      // handle the order creation to avoid the profile recursion issue
      onSuccess(paymentId);
      toast.success("Payment confirmed successfully!");
      
    } catch (err: any) {
      console.error("Error confirming payment:", err);
      setError(err.message || "Failed to confirm payment");
      toast.error(err.message || "Failed to confirm payment");
    } finally {
      setIsProcessing(false);
    }
  };

  // Go back to payment form
  const backToPaymentForm = () => {
    setPaymentStep("form");
    setQrisImage("");
    setPaymentId("");
  };

  return {
    isProcessing,
    paymentStep,
    qrisImage,
    paymentId,
    error,
    handlePaymentFormSubmit,
    confirmPayment,
    backToPaymentForm
  };
}
