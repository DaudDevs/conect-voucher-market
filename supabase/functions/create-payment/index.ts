
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { items, userId } = await req.json();
    
    if (!items || !Array.isArray(items) || items.length === 0) {
      return new Response(
        JSON.stringify({ error: "Invalid items provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // This is a simulated payment process
    // In a real implementation, you would integrate with a payment provider like Midtrans or Xendit
    
    // Calculate total
    const total = items.reduce((sum, item) => {
      const price = item.discount 
        ? item.price * (1 - item.discount / 100) 
        : item.price;
      return sum + (price * item.quantity);
    }, 0);
    
    // Simulate payment processing
    const paymentId = crypto.randomUUID();
    
    // Generate a simulated QR code URL
    // In a real implementation, this would come from your payment provider's API
    const qrisUrl = "https://cdn.worldvectorlogo.com/logos/qris-1.svg";
    
    // Return successful payment response with QRIS URL
    return new Response(
      JSON.stringify({
        success: true,
        paymentId,
        total,
        qrisUrl,
        message: "QRIS code generated successfully",
        timestamp: new Date().toISOString()
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  } catch (error) {
    console.error("Error processing payment:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false,
        message: "Internal server error" 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
