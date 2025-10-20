import { useRoute, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, Heart, ExternalLink, Loader2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import type { Recipe } from "@shared/schema";

export default function RecipeDetailPage() {
  const [, params] = useRoute("/resep/:id");
  const [, setLocation] = useLocation();
  const recipeId = params?.id;

  const { data: recipe, isLoading } = useQuery<Recipe>({
    queryKey: [`/api/recipes/${recipeId}`],
    enabled: !!recipeId,
  });

  const { data: favoriteIds = [] } = useQuery<string[]>({
    queryKey: ["/api/favorites"],
    queryFn: async () => {
      const res = await fetch("/api/favorites", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch favorites");
      return res.json();
    },
  });

  const addFavoriteMutation = useMutation({
    mutationFn: async (recipeId: string) => {
      await apiRequest("POST", `/api/favorites/${recipeId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/favorites"] });
      queryClient.invalidateQueries({ queryKey: ["/api/favorites/recipes"] });
    },
  });

  const removeFavoriteMutation = useMutation({
    mutationFn: async (recipeId: string) => {
      await apiRequest("DELETE", `/api/favorites/${recipeId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/favorites"] });
      queryClient.invalidateQueries({ queryKey: ["/api/favorites/recipes"] });
    },
  });

  const toggleFavorite = () => {
    if (!recipeId) return;
    if (favoriteIds.includes(recipeId)) {
      removeFavoriteMutation.mutate(recipeId);
    } else {
      addFavoriteMutation.mutate(recipeId);
    }
  };

  const isFavorite = recipeId ? favoriteIds.includes(recipeId) : false;

  const getYouTubeEmbedUrl = (url: string | null | undefined) => {
    if (!url) return null;
    const videoIdMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s]+)/);
    if (videoIdMatch) {
      return `https://www.youtube.com/embed/${videoIdMatch[1]}`;
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
          <p className="text-lg text-muted-foreground">Memuat resep...</p>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-xl text-muted-foreground mb-6">Resep tidak ditemukan</p>
          <Button onClick={() => setLocation("/")}>Kembali ke Beranda</Button>
        </div>
      </div>
    );
  }

  const embedUrl = getYouTubeEmbedUrl(recipe.videoUrl);

  return (
    <div className="min-h-screen bg-background py-8 px-6">
      <div className="max-w-6xl mx-auto">
        <Button
          variant="outline"
          onClick={() => setLocation("/")}
          className="mb-6"
          data-testid="button-back-home"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali
        </Button>

        {/* Recipe Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground" data-testid="text-recipe-title">
              {recipe.name}
            </h1>
            <Button
              variant={isFavorite ? "default" : "outline"}
              onClick={toggleFavorite}
              className="h-12 px-6 w-full md:w-auto"
              data-testid="button-toggle-favorite"
              disabled={addFavoriteMutation.isPending || removeFavoriteMutation.isPending}
            >
              <Heart className={`w-5 h-5 mr-2 ${isFavorite ? "fill-current" : ""}`} />
              {isFavorite ? "Tersimpan" : "Simpan Resep"}
            </Button>
          </div>
          
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-6">
            {recipe.description}
          </p>

          <div className="flex flex-wrap gap-3">
            <Badge className="h-9 px-4 text-base bg-chart-2 text-white">
              {recipe.minAge}-{recipe.maxAge} bulan
            </Badge>
            <Badge className="h-9 px-4 text-base bg-chart-3 text-foreground flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {recipe.cookingTime} menit
            </Badge>
            <Badge variant="secondary" className="h-9 px-4 text-base">
              Sumber: {recipe.source}
            </Badge>
          </div>
        </div>

        {/* Recipe Image */}
        <div className="mb-8 rounded-xl overflow-hidden aspect-video">
          <img
            src={recipe.imageUrl || ""}
            alt={recipe.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-2 space-y-8">
            {/* Nutritional Benefits */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Manfaat Gizi</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {recipe.nutritionalBenefits.map((benefit, index) => (
                    <Badge
                      key={index}
                      className="h-9 px-4 text-base bg-chart-1 text-foreground"
                      data-testid={`badge-benefit-${index}`}
                    >
                      {benefit}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Cara Membuat</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-4">
                  {recipe.instructions.map((step, index) => (
                    <li key={index} className="flex gap-4" data-testid={`step-${index}`}>
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold text-lg">
                        {index + 1}
                      </div>
                      <p className="text-base text-foreground leading-relaxed pt-1.5">
                        {step}
                      </p>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>

            {/* Video Tutorial */}
            {embedUrl && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Video Tutorial</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video rounded-lg overflow-hidden shadow-lg">
                    <iframe
                      src={embedUrl}
                      title={`Tutorial ${recipe.name}`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                      data-testid="iframe-video"
                    />
                  </div>
                  {recipe.videoUrl && (
                    <a
                      href={recipe.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 mt-4 text-primary hover:underline"
                      data-testid="link-youtube"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Tonton di YouTube
                    </a>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar - Right Side */}
          <div className="space-y-6">
            {/* Ingredients */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Bahan-Bahan</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 text-base"
                      data-testid={`ingredient-${index}`}
                    >
                      <span className="text-primary mt-1">•</span>
                      <span className="text-foreground">{ingredient}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Tools */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Alat yang Dibutuhkan</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {recipe.tools.map((tool, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 text-base"
                      data-testid={`tool-${index}`}
                    >
                      <span className="text-primary mt-1">•</span>
                      <span className="text-foreground">{tool}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Educational Disclaimer */}
        <Card className="border-chart-2/20 bg-chart-2/5">
          <CardContent className="p-6 md:p-8">
            <p className="text-sm text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Catatan Penting:</strong> Resep ini bersifat edukatif dan tidak menggantikan 
              konsultasi dengan dokter anak atau ahli gizi. Pastikan untuk berkonsultasi dengan tenaga medis 
              profesional mengenai kebutuhan nutrisi khusus anak Anda, terutama jika anak memiliki alergi 
              atau kondisi kesehatan tertentu.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
