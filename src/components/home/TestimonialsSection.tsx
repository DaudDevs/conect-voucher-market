
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const testimonials = [
  {
    id: 1,
    name: "Budi Santoso",
    avatar: "",
    role: "Small Business Owner",
    content: "ConnectVoucher made it incredibly easy for me to manage internet vouchers for my café. The process is seamless and my customers are very satisfied with the internet speed.",
  },
  {
    id: 2,
    name: "Siti Rahayu",
    avatar: "",
    role: "Hotel Manager",
    content: "We've switched to offering ConnectVoucher codes to our guests instead of managing our own system. It's been cost-effective and much easier to manage.",
  },
  {
    id: 3,
    name: "Doni Pramana",
    avatar: "",
    role: "Internet Café Owner",
    content: "I've tried many voucher providers but ConnectVoucher offers the best combination of price, reliability and customer service. Highly recommended.",
  }
];

const TestimonialsSection = () => {
  return (
    <section className="py-12 bg-muted/30">
      <div className="container">
        <h2 className="text-2xl font-bold text-center mb-2">What Our Customers Say</h2>
        <p className="text-center text-muted-foreground mb-8">Trusted by businesses and individuals across Indonesia</p>
        
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="bg-background">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar>
                    <AvatarImage src={testimonial.avatar} />
                    <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-muted-foreground italic">{testimonial.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
