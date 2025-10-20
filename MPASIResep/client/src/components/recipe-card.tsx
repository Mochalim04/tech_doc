import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Heart } from "lucide-react";
import type { Recipe } from "@shared/schema";

interface RecipeCardProps {
  recipe: Recipe;
  isFavorite?: boolean;
  onToggleFavorite?: (recipeId: string) => void;
}

export function RecipeCard({ recipe, isFavorite = false, onToggleFavorite }: RecipeCardProps) {
  return (
    <Card className="overflow-hidden hover-elevate transition-all duration-200" data-testid={`card-recipe-${recipe.id}`}>
      <div className="relative aspect-video">
        <img
          src={recipe.imageUrl || ""}
          alt={recipe.name}
          className="w-full h-full object-cover"
        />
        <Badge 
          className="absolute top-3 right-3 h-8 px-3 text-sm bg-chart-2/90 text-white border-0"
          data-testid={`badge-age-${recipe.id}`}
        >
          {recipe.minAge}-{recipe.maxAge} bulan
        </Badge>
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge 
            className="h-8 px-3 text-sm bg-chart-3/90 text-foreground border-0 flex items-center gap-1"
            data-testid={`badge-time-${recipe.id}`}
          >
            <Clock className="w-3 h-3" />
            {recipe.cookingTime} mnt
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-6 space-y-4">
        <div>
          <h3 className="text-xl font-semibold mb-2 text-foreground line-clamp-2" data-testid={`text-recipe-name-${recipe.id}`}>
            {recipe.name}
          </h3>
          <p className="text-base text-muted-foreground line-clamp-3 leading-relaxed">
            {recipe.description}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {recipe.nutritionalBenefits.slice(0, 2).map((benefit, index) => (
            <Badge key={index} variant="secondary" className="h-7 text-sm">
              {benefit}
            </Badge>
          ))}
          {recipe.nutritionalBenefits.length > 2 && (
            <Badge variant="secondary" className="h-7 text-sm">
              +{recipe.nutritionalBenefits.length - 2} lagi
            </Badge>
          )}
        </div>

        <div className="flex gap-3 pt-2">
          <Link href={`/resep/${recipe.id}`} className="flex-1" data-testid={`link-recipe-${recipe.id}`}>
            <Button className="w-full h-12" data-testid={`button-view-${recipe.id}`}>
              Lihat Resep
            </Button>
          </Link>
          {onToggleFavorite && (
            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12 flex-shrink-0"
              onClick={() => onToggleFavorite(recipe.id)}
              data-testid={`button-favorite-${recipe.id}`}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? "fill-destructive text-destructive" : ""}`} />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
