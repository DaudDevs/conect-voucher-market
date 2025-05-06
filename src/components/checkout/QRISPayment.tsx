
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface QRISPaymentProps {
  qrisImage: string;
  paymentId: string;
  total: number;
  onConfirmPayment: () => void;
  onBackToForm: () => void;
}

const QRISPayment: React.FC<QRISPaymentProps> = ({
  qrisImage,
  paymentId,
  total,
  onConfirmPayment,
  onBackToForm
}) => {
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
          {paymentId && (
            <p className="text-xs mt-1 text-muted-foreground">
              Payment ID: {paymentId}
            </p>
          )}
        </div>
        
        <div className="space-y-3">
          <Button 
            className="w-full" 
            onClick={onConfirmPayment}
            variant="default"
          >
            I've Completed Payment
          </Button>
          <Button 
            className="w-full" 
            onClick={onBackToForm}
            variant="outline"
          >
            Back to Payment Options
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QRISPayment;
