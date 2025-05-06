
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";

const NotFound = () => {
  const navigate = useNavigate();
  
  return (
    <div className="container flex flex-col items-center justify-center py-16">
      <AlertCircle className="text-red-500 w-16 h-16 mb-4" />
      <h1 className="text-5xl font-bold text-brand-blue mb-4">404</h1>
      <h2 className="text-2xl font-medium mb-2">Halaman Tidak Ditemukan</h2>
      <p className="text-muted-foreground text-center mb-6 max-w-md">
        Halaman yang Anda cari tidak ada atau telah dipindahkan.
      </p>
      <div className="flex gap-4">
        <Button onClick={() => navigate(-1)}>Kembali</Button>
        <Button variant="outline" onClick={() => navigate("/")}>
          Kembali ke Beranda
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
