
import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const formSchema = z.object({
  cardNumber: z.string().min(16, "Card number must be at least 16 digits"),
  cardHolder: z.string().min(3, "Cardholder name is required"),
  expiryDate: z.string().regex(/^\d{2}\/\d{2}$/, "Format must be MM/YY"),
  cvv: z.string().min(3, "CVV must be at least 3 digits"),
});

export type PaymentFormValues = z.infer<typeof formSchema>;

interface PaymentFormCardProps {
  total: number;
  isProcessing: boolean;
  onSubmit: (values: PaymentFormValues) => void;
}

const PaymentFormCard: React.FC<PaymentFormCardProps> = ({ 
  total, 
  isProcessing, 
  onSubmit 
}) => {
  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cardNumber: "",
      cardHolder: "",
      expiryDate: "",
      cvv: "",
    },
  });

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

export default PaymentFormCard;
