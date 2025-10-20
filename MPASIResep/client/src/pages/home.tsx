import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { UtensilsCrossed, Clock, Baby, Heart } from "lucide-react";
import heroImage from "@assets/generated_images/Hero_banner_MPASI_ingredients_illustration_0178c9e3.png";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[400px] md:h-[500px] w-full overflow-hidden">
        <img 
          src={heroImage} 
          alt="Ilustrasi bahan MPASI segar" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/70 to-primary/40" />
        <div className="relative h-full flex flex-col items-center justify-center text-center px-6 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-4 md:mb-6">
            MPASI Pintar
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-primary-foreground/95 mb-8 md:mb-10 leading-relaxed max-w-2xl">
            Temukan resep MPASI bergizi berdasarkan bahan yang tersedia di rumah, usia anak, dan waktu memasak Anda
          </p>
          <Link href="/cari-resep" data-testid="link-find-recipes">
            <Button 
              size="lg" 
              variant="outline" 
              className="h-14 px-8 text-lg font-semibold backdrop-blur-md bg-white/90 hover:bg-white border-2 border-white text-primary"
              data-testid="button-start-finding"
            >
              <UtensilsCrossed className="w-5 h-5 mr-2" />
              Mulai Cari Resep
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-semibold text-center mb-12 md:mb-16 text-foreground">
            Mengapa MPASI Pintar?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <Card className="hover-elevate transition-transform duration-200">
              <CardContent className="p-6 md:p-8">
                <div className="w-14 h-14 rounded-full bg-accent flex items-center justify-center mb-6">
                  <UtensilsCrossed className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-foreground">
                  Sesuai Bahan di Rumah
                </h3>
                <p className="text-base text-muted-foreground leading-relaxed">
                  Masukkan bahan yang ada di kulkas, kami carikan resep yang cocok tanpa perlu belanja lagi
                </p>
              </CardContent>
            </Card>

            <Card className="hover-elevate transition-transform duration-200">
              <CardContent className="p-6 md:p-8">
                <div className="w-14 h-14 rounded-full bg-accent flex items-center justify-center mb-6">
                  <Baby className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-foreground">
                  Disesuaikan Usia Anak
                </h3>
                <p className="text-base text-muted-foreground leading-relaxed">
                  Resep yang aman dan bergizi sesuai tahap perkembangan bayi usia 6-24 bulan
                </p>
              </CardContent>
            </Card>

            <Card className="hover-elevate transition-transform duration-200">
              <CardContent className="p-6 md:p-8">
                <div className="w-14 h-14 rounded-full bg-accent flex items-center justify-center mb-6">
                  <Clock className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-foreground">
                  Hemat Waktu
                </h3>
                <p className="text-base text-muted-foreground leading-relaxed">
                  Filter berdasarkan waktu memasak, cocok untuk Anda yang sibuk
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Educational Disclaimer */}
      <section className="py-8 md:py-12 px-6 bg-chart-2/10">
        <div className="max-w-4xl mx-auto">
          <Card className="border-chart-2/20">
            <CardContent className="p-6 md:p-8">
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-chart-2/20 flex items-center justify-center flex-shrink-0">
                  <Heart className="w-5 h-5 text-chart-2" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-foreground">
                    Informasi Penting
                  </h3>
                  <p className="text-base text-muted-foreground leading-relaxed mb-3">
                    Resep-resep di MPASI Pintar bersifat edukatif dan disusun berdasarkan pedoman dari:
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1 mb-4">
                    <li>• Kementerian Kesehatan Republik Indonesia (Kemenkes RI)</li>
                    <li>• Ikatan Dokter Anak Indonesia (IDAI)</li>
                    <li>• World Health Organization (WHO)</li>
                  </ul>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    <strong className="text-foreground">Catatan:</strong> Informasi ini tidak menggantikan konsultasi dengan dokter anak atau ahli gizi. 
                    Selalu konsultasikan kondisi kesehatan dan nutrisi anak Anda dengan tenaga medis profesional.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
