import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const recipes = pgTable("recipes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  ingredients: text("ingredients").array().notNull(),
  instructions: text("instructions").array().notNull(),
  minAge: integer("min_age").notNull(),
  maxAge: integer("max_age").notNull(),
  cookingTime: integer("cooking_time").notNull(),
  nutritionalBenefits: text("nutritional_benefits").array().notNull(),
  tools: text("tools").array().notNull(),
  videoUrl: text("video_url"),
  imageUrl: text("image_url"),
  source: text("source").notNull(),
});

export const insertRecipeSchema = createInsertSchema(recipes).omit({
  id: true,
});

export type InsertRecipe = z.infer<typeof insertRecipeSchema>;
export type Recipe = typeof recipes.$inferSelect;

export const recipeSearchSchema = z.object({
  ingredients: z.array(z.string()).optional(),
  minAge: z.number().min(6).max(24).optional(),
  maxAge: z.number().min(6).max(24).optional(),
  maxCookingTime: z.number().optional(),
});

export type RecipeSearch = z.infer<typeof recipeSearchSchema>;
