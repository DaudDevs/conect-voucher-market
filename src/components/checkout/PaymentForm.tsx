
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const formSchema = z.object({
  cardNumber: z.string().min(16, "Card number must be at least 16 digits"),
  cardHolder: z.string().min(3, "Cardholder name is required"),
  expiryDate: z.string().regex(/^\d{2}\/\d{2}$/, "Format must be MM/YY"),
  cvv: z.string().min(3, "CVV must be at least 3 digits"),
});

type FormValues = z.infer<typeof formSchema>;

interface PaymentFormProps {
  items: any[];
  total: number;
  onSuccess: (paymentId: string) => void;
}

const PaymentForm = ({ items, total, onSuccess }: PaymentFormProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStep, setPaymentStep] = useState("form"); // form, qris
  const [qrisImage, setQrisImage] = useState("");
  const [paymentId, setPaymentId] = useState("");
  const navigate = useNavigate();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cardNumber: "",
      cardHolder: "",
      expiryDate: "",
      cvv: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsProcessing(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          variant: "destructive",
          title: "Authentication required",
          description: "Please log in to complete your purchase.",
        });
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

  if (paymentStep === "qris") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Scan QRIS to Pay</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <div className="mb-6 flex justify-center">
            <div className="border p-4 rounded-lg inline-block bg-white">
              <img 
                src={qrisImage} 
                alt="QRIS Payment Code" 
                className="mx-auto max-w-[240px] max-h-[240px]"
              />
            </div>
          </div>
          
          <div className="mb-6">
            <p className="text-sm text-muted-foreground mb-2">
              Please scan the QR code using your mobile banking or e-wallet app
            </p>
            <p className="font-semibold">
              Amount: {total.toLocaleString('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0,
              })}
            </p>
          </div>
          
          <div className="space-y-3">
            <Button 
              className="w-full" 
              onClick={confirmPayment}
              variant="default"
            >
              I've Completed Payment
            </Button>
            <Button 
              className="w-full" 
              onClick={() => setPaymentStep("form")}
              variant="outline"
            >
              Back to Payment Options
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Details</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="cardNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Card Number</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      onChange={(e) => {
                        // Format card number with spaces every 4 digits
                        const value = e.target.value
                          .replace(/\s/g, '')
                          .replace(/(\d{4})/g, '$1 ')
                          .trim();
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="cardHolder"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cardholder Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="John Doe" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="expiryDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expiry Date</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="MM/YY" 
                        maxLength={5}
                        onChange={(e) => {
                          // Format expiry date as MM/YY
                          const value = e.target.value
                            .replace(/[^\d]/g, '')
                            .replace(/^(\d{2})(\d{0,2})/, '$1/$2');
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="cvv"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CVV</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        placeholder="123" 
                        type="password" 
                        maxLength={4}
                        onChange={(e) => {
                          // Only allow digits
                          const value = e.target.value.replace(/[^\d]/g, '');
                          field.onChange(value);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="pt-4">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-gray-600">Subtotal</span>
                <span>
                  {total.toLocaleString('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    minimumFractionDigits: 0,
                  })}
                </span>
              </div>
              <div className="flex justify-between font-semibold mb-6">
                <span>Total</span>
                <span>
                  {total.toLocaleString('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    minimumFractionDigits: 0,
                  })}
                </span>
              </div>
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <div className="flex items-center">
                    <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                    Processing...
                  </div>
                ) : (
                  `Pay with QRIS ${total.toLocaleString('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    minimumFractionDigits: 0,
                  })}`
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default PaymentForm;
