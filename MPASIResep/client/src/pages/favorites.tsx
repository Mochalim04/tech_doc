import { useQuery, useMutation } from "@tanstack/react-query";
import { RecipeCard } from "@/components/recipe-card";
import { Button } from "@/components/ui/button";
import { Heart, Loader2 } from "lucide-react";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import type { Recipe } from "@shared/schema";

export default function FavoritesPage() {
  const [, setLocation] = useLocation();

  const { data: favoriteRecipes = [], isLoading } = useQuery<Recipe[]>({
    queryKey: ["/api/favorites/recipes"],
    queryFn: async () => {
      const res = await fetch("/api/favorites/recipes", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch favorite recipes");
      return res.json();
    },
  });

  const removeFavoriteMutation = useMutation({
    mutationFn: async (recipeId: string) => {
      await apiRequest("DELETE", `/api/favorites/${recipeId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/favorites/recipes"] });
      queryClient.invalidateQueries({ queryKey: ["/api/favorites"] });
    },
  });

  const toggleFavorite = (recipeId: string) => {
    removeFavoriteMutation.mutate(recipeId);
  };

  return (
    <div className="min-h-screen bg-background py-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-foreground">
            <Heart className="inline-block w-8 h-8 md:w-10 md:h-10 mr-3 text-destructive fill-destructive" />
            Resep Favorit
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground">
            Kumpulan resep yang Anda simpan
          </p>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
            <p className="text-lg text-muted-foreground">Memuat resep favorit...</p>
          </div>
        ) : favoriteRecipes.length > 0 ? (
          <>
            <p className="text-lg text-muted-foreground mb-8" data-testid="text-favorites-count">
              Anda memiliki <strong className="text-foreground">{favoriteRecipes.length}</strong> resep favorit
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {favoriteRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  isFavorite={true}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <Heart className="w-20 h-20 text-muted-foreground/30 mx-auto mb-6" />
            <p className="text-xl text-muted-foreground mb-4">
              Belum ada resep favorit
            </p>
            <p className="text-base text-muted-foreground mb-8">
              Mulai cari dan simpan resep favorit Anda
            </p>
            <Button onClick={() => setLocation("/cari-resep")} data-testid="button-find-recipes">
              Cari Resep
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
