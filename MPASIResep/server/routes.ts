import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { recipeSearchSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all recipes or search with filters
  app.get("/api/recipes", async (req, res) => {
    try {
      const ingredients = req.query.ingredients 
        ? (req.query.ingredients as string).split(',').map(i => i.trim()).filter(Boolean)
        : undefined;
      
      const age = req.query.age ? String(req.query.age) : undefined;
      let minAge: number | undefined;
      let maxAge: number | undefined;
      
      if (age) {
        const ageRange = age.split('-');
        if (ageRange.length === 2) {
          minAge = parseInt(ageRange[0]);
          maxAge = parseInt(ageRange[1]);
        }
      }
      
      const maxCookingTime = req.query.time ? parseInt(req.query.time as string) : undefined;

      const searchParams = {
        ingredients,
        minAge,
        maxAge,
        maxCookingTime,
      };

      // Validate search parameters
      const validatedSearch = recipeSearchSchema.parse(searchParams);
      
      const recipes = await storage.searchRecipes(validatedSearch);
      res.json(recipes);
    } catch (error) {
      console.error("Error searching recipes:", error);
      res.status(400).json({ error: "Invalid search parameters" });
    }
  });

  // Get specific recipe by ID
  app.get("/api/recipes/:id", async (req, res) => {
    try {
      const recipe = await storage.getRecipeById(req.params.id);
      
      if (!recipe) {
        return res.status(404).json({ error: "Recipe not found" });
      }
      
      res.json(recipe);
    } catch (error) {
      console.error("Error fetching recipe:", error);
      res.status(500).json({ error: "Failed to fetch recipe" });
    }
  });

  // Get all favorite recipe IDs for current session
  app.get("/api/favorites", async (req, res) => {
    try {
      const sessionId = req.session.id;
      const favoriteIds = await storage.getFavorites(sessionId);
      res.json(favoriteIds);
    } catch (error) {
      console.error("Error fetching favorites:", error);
      res.status(500).json({ error: "Failed to fetch favorites" });
    }
  });

  // Get favorite recipes (full recipe objects) for current session
  app.get("/api/favorites/recipes", async (req, res) => {
    try {
      const sessionId = req.session.id;
      const favoriteIds = await storage.getFavorites(sessionId);
      
      if (favoriteIds.length === 0) {
        return res.json([]);
      }

      const recipes = await storage.getRecipesByIds(favoriteIds);
      res.json(recipes);
    } catch (error) {
      console.error("Error fetching favorite recipes:", error);
      res.status(500).json({ error: "Failed to fetch favorite recipes" });
    }
  });

  // Add a recipe to favorites
  app.post("/api/favorites/:id", async (req, res) => {
    try {
      const sessionId = req.session.id;
      const recipeId = req.params.id;
      
      await storage.addFavorite(sessionId, recipeId);
      res.json({ success: true, message: "Recipe added to favorites" });
    } catch (error) {
      console.error("Error adding favorite:", error);
      const message = error instanceof Error ? error.message : "Failed to add favorite";
      res.status(400).json({ error: message });
    }
  });

  // Remove a recipe from favorites
  app.delete("/api/favorites/:id", async (req, res) => {
    try {
      const sessionId = req.session.id;
      const recipeId = req.params.id;
      
      await storage.removeFavorite(sessionId, recipeId);
      res.json({ success: true, message: "Recipe removed from favorites" });
    } catch (error) {
      console.error("Error removing favorite:", error);
      res.status(500).json({ error: "Failed to remove favorite" });
    }
  });

  // Placeholder image endpoint
  app.get("/api/placeholder-image/:type", (req, res) => {
    const { type } = req.params;
    
    // Map placeholder types to actual generated images
    const imageMap: Record<string, string> = {
      puree: "/attached_assets/generated_images/Baby_puree_food_photograph_421aacb0.png",
      fingerfood: "/attached_assets/generated_images/Baby_finger_foods_photograph_febf8b26.png",
      porridge: "/attached_assets/generated_images/Baby_porridge_food_photograph_86e0c34a.png",
    };
    
    const imagePath = imageMap[type] || imageMap.puree;
    res.redirect(imagePath);
  });

  const httpServer = createServer(app);
  return httpServer;
}
