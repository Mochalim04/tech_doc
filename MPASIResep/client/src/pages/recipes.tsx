import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { RecipeCard } from "@/components/recipe-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Loader2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import type { Recipe } from "@shared/schema";

export default function RecipesPage() {
  const [location, setLocation] = useLocation();
  const params = new URLSearchParams(location.split("?")[1]);
  
  const ingredients = params.get("ingredients")?.split(",").filter(Boolean) || [];
  const age = params.get("age") || "";
  const time = params.get("time") || "";

  const { data: recipes, isLoading } = useQuery<Recipe[]>({
    queryKey: ["/api/recipes", { ingredients, age, time }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (ingredients.length > 0) {
        params.set("ingredients", ingredients.join(","));
      }
      if (age) {
        params.set("age", age);
      }
      if (time) {
        params.set("time", time);
      }
      const url = `/api/recipes?${params.toString()}`;
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch recipes");
      return res.json();
    },
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

  const toggleFavorite = (recipeId: string) => {
    if (favoriteIds.includes(recipeId)) {
      removeFavoriteMutation.mutate(recipeId);
    } else {
      addFavoriteMutation.mutate(recipeId);
    }
  };

  return (
    <div className="min-h-screen bg-background py-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => setLocation("/cari-resep")}
            className="mb-6"
            data-testid="button-back-search"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Pencarian
          </Button>

          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Hasil Pencarian Resep
          </h1>

          {(ingredients.length > 0 || age || time) && (
            <div className="flex flex-wrap gap-2 mb-6">
              {ingredients.map((ingredient) => (
                <Badge key={ingredient} variant="secondary" className="h-8 text-sm">
                  Bahan: {ingredient}
                </Badge>
              ))}
              {age && (
                <Badge variant="secondary" className="h-8 text-sm">
                  Usia: {age} bulan
                </Badge>
              )}
              {time && (
                <Badge variant="secondary" className="h-8 text-sm">
                  Waktu: {time === "999" ? "Lebih dari 1 jam" : `${time} menit`}
                </Badge>
              )}
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
            <p className="text-lg text-muted-foreground">Mencari resep yang sesuai...</p>
          </div>
        ) : recipes && recipes.length > 0 ? (
          <>
            <p className="text-lg text-muted-foreground mb-8" data-testid="text-results-count">
              Ditemukan <strong className="text-foreground">{recipes.length}</strong> resep yang sesuai
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {recipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  isFavorite={favoriteIds.includes(recipe.id)}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <p className="text-xl text-muted-foreground mb-4">
              Tidak ada resep yang ditemukan
            </p>
            <p className="text-base text-muted-foreground mb-8">
              Coba ubah kriteria pencarian Anda atau hapus beberapa filter
            </p>
            <Button onClick={() => setLocation("/cari-resep")} data-testid="button-new-search">
              Cari Lagi
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
