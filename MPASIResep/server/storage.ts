import { type Recipe, type InsertRecipe, type RecipeSearch } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getAllRecipes(): Promise<Recipe[]>;
  getRecipeById(id: string): Promise<Recipe | undefined>;
  getRecipesByIds(ids: string[]): Promise<Recipe[]>;
  searchRecipes(search: RecipeSearch): Promise<Recipe[]>;
  getFavorites(sessionId: string): Promise<string[]>;
  addFavorite(sessionId: string, recipeId: string): Promise<void>;
  removeFavorite(sessionId: string, recipeId: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private recipes: Map<string, Recipe>;
  private favorites: Map<string, Set<string>>; // sessionId -> Set of recipeIds

  constructor() {
    this.recipes = new Map();
    this.favorites = new Map();
    this.seedRecipes();
  }

  private seedRecipes() {
    const recipesData: InsertRecipe[] = [
      {
        name: "Pure Pisang Alpukat",
        description: "Pure lembut dari pisang dan alpukat yang kaya akan nutrisi untuk bayi 6 bulan pertama",
        ingredients: ["1 buah pisang ambon matang", "½ buah alpukat matang", "2-3 sendok makan ASI/susu formula"],
        instructions: [
          "Kupas pisang dan alpukat, potong kecil-kecil",
          "Haluskan pisang dan alpukat menggunakan blender atau garpu",
          "Tambahkan ASI atau susu formula sedikit demi sedikit hingga tekstur lembut",
          "Sajikan segera agar tidak berubah warna"
        ],
        minAge: 6,
        maxAge: 8,
        cookingTime: 10,
        nutritionalBenefits: ["Kaya serat", "Lemak sehat", "Vitamin C", "Mendukung perkembangan otak"],
        tools: ["Blender atau garpu", "Mangkuk", "Sendok"],
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        imageUrl: "/api/placeholder-image/puree",
        source: "IDAI - Panduan MPASI 6 Bulan"
      },
      {
        name: "Bubur Beras Merah dengan Wortel",
        description: "Bubur bergizi dengan beras merah dan wortel yang kaya akan vitamin A",
        ingredients: ["2 sendok makan beras merah", "1 buah wortel kecil, potong dadu", "300 ml air/kaldu ayam tanpa garam", "1 sendok teh minyak zaitun"],
        instructions: [
          "Cuci bersih beras merah dan rendam 2 jam (opsional untuk tekstur lebih lembut)",
          "Rebus beras merah dengan air atau kaldu hingga setengah matang",
          "Masukkan wortel yang sudah dipotong dadu kecil",
          "Masak hingga wortel dan beras sangat lembut (sekitar 30-40 menit)",
          "Blender atau saring sesuai tekstur yang diinginkan",
          "Tambahkan minyak zaitun sebelum disajikan"
        ],
        minAge: 6,
        maxAge: 9,
        cookingTime: 45,
        nutritionalBenefits: ["Tinggi serat", "Vitamin A", "Antioksidan", "Mendukung kesehatan mata"],
        tools: ["Panci", "Blender", "Saringan kawat", "Sendok"],
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        imageUrl: "/api/placeholder-image/porridge",
        source: "Kemenkes RI - Pedoman MPASI"
      },
      {
        name: "Pure Ubi Jalar Ungu",
        description: "Pure dari ubi jalar ungu yang kaya antioksidan dan manis alami",
        ingredients: ["1 buah ubi jalar ungu ukuran sedang (100g)", "3 sendok makan ASI/susu formula"],
        instructions: [
          "Kupas dan potong ubi jalar menjadi potongan kecil",
          "Kukus ubi jalar hingga sangat lembut (sekitar 15-20 menit)",
          "Haluskan ubi menggunakan blender atau garpu",
          "Tambahkan ASI/susu formula untuk mencapai konsistensi yang diinginkan",
          "Sajikan hangat"
        ],
        minAge: 6,
        maxAge: 8,
        cookingTime: 25,
        nutritionalBenefits: ["Tinggi antioksidan", "Vitamin A & C", "Serat", "Karbohidrat kompleks"],
        tools: ["Kukusan", "Blender atau garpu", "Pisau", "Mangkuk"],
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        imageUrl: "/api/placeholder-image/puree",
        source: "IDAI"
      },
      {
        name: "Nasi Tim Ayam Sayur",
        description: "Nasi tim lengkap dengan ayam dan sayuran untuk bayi 8 bulan ke atas",
        ingredients: ["3 sendok makan beras putih", "30 gram dada ayam tanpa kulit", "2 sendok makan wortel parut", "1 sendok makan bayam cincang", "250 ml air/kaldu ayam tanpa garam", "1 sendok teh minyak zaitun"],
        instructions: [
          "Cuci bersih beras dan tiriskan",
          "Potong ayam kecil-kecil, parut wortel, cincang bayam halus",
          "Campur semua bahan dalam mangkuk tahan panas",
          "Tim selama 30-40 menit hingga matang dan tekstur lembut",
          "Haluskan sesuai kemampuan mengunyah bayi",
          "Tambahkan minyak zaitun sebelum disajikan"
        ],
        minAge: 8,
        maxAge: 11,
        cookingTime: 45,
        nutritionalBenefits: ["Protein hewani", "Zat besi", "Vitamin A", "Kalsium dari sayuran"],
        tools: ["Mangkuk tahan panas", "Panci kukus", "Blender (opsional)", "Parutan"],
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        imageUrl: "/api/placeholder-image/porridge",
        source: "Kemenkes RI"
      },
      {
        name: "Finger Food Brokoli Kukus",
        description: "Brokoli kukus lembut untuk melatih kemampuan makan sendiri",
        ingredients: ["5-6 kuntum brokoli ukuran sedang", "1 sendok teh minyak zaitun (opsional)"],
        instructions: [
          "Cuci bersih brokoli dan potong menjadi floret dengan tangkai yang cukup untuk digenggam bayi",
          "Kukus brokoli selama 7-10 menit hingga sangat lembut tapi tidak hancur",
          "Tes dengan garpu - harus mudah hancur saat ditekan",
          "Biarkan dingin hingga suhu yang aman",
          "Sajikan langsung atau olesi sedikit minyak zaitun"
        ],
        minAge: 8,
        maxAge: 12,
        cookingTime: 15,
        nutritionalBenefits: ["Vitamin C", "Kalsium", "Serat", "Antioksidan"],
        tools: ["Kukusan", "Pisau", "Piring"],
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        imageUrl: "/api/placeholder-image/fingerfood",
        source: "WHO - Baby Led Weaning Guide"
      },
      {
        name: "Pure Labu Kuning dengan Keju",
        description: "Pure labu kuning yang diperkaya dengan keju untuk tambahan kalsium",
        ingredients: ["150 gram labu kuning", "1 sendok makan keju parut (tanpa garam tambahan)", "2 sendok makan ASI/susu formula"],
        instructions: [
          "Kupas dan potong labu kuning menjadi dadu kecil",
          "Kukus labu hingga sangat lembut (15-20 menit)",
          "Haluskan labu dengan blender atau garpu",
          "Campur dengan keju parut hingga rata",
          "Tambahkan ASI/susu formula untuk konsistensi yang tepat",
          "Sajikan hangat"
        ],
        minAge: 7,
        maxAge: 10,
        cookingTime: 25,
        nutritionalBenefits: ["Vitamin A tinggi", "Kalsium", "Protein", "Beta karoten"],
        tools: ["Kukusan", "Blender", "Parutan keju", "Mangkuk"],
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        imageUrl: "/api/placeholder-image/puree",
        source: "IDAI"
      },
      {
        name: "Bubur Kacang Hijau",
        description: "Bubur kacang hijau yang kaya protein nabati dan mudah dicerna",
        ingredients: ["3 sendok makan kacang hijau", "200 ml air", "1 lembar daun pandan", "50 ml santan encer (opsional untuk 9+ bulan)"],
        instructions: [
          "Cuci bersih kacang hijau dan rendam 2 jam",
          "Rebus kacang hijau dengan air dan daun pandan hingga sangat lembut (30-40 menit)",
          "Angkat daun pandan",
          "Blender kacang hijau dengan sedikit air rebusan hingga halus",
          "Untuk bayi 9 bulan ke atas, bisa tambahkan santan encer",
          "Sajikan hangat dengan konsistensi yang sesuai"
        ],
        minAge: 7,
        maxAge: 12,
        cookingTime: 50,
        nutritionalBenefits: ["Protein nabati", "Zat besi", "Folat", "Serat"],
        tools: ["Panci", "Blender", "Saringan", "Sendok"],
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        imageUrl: "/api/placeholder-image/porridge",
        source: "Kemenkes RI"
      },
      {
        name: "Scrambled Egg Lembut",
        description: "Telur orak-arik lembut yang kaya protein untuk bayi 8 bulan ke atas",
        ingredients: ["1 butir telur ayam kampung/omega", "2 sendok makan ASI/susu formula", "1 sendok teh mentega tawar"],
        instructions: [
          "Kocok telur dengan ASI/susu hingga tercampur rata",
          "Panaskan mentega di wajan anti lengket dengan api kecil",
          "Tuang campuran telur, aduk perlahan dengan spatula",
          "Masak dengan api sangat kecil hingga telur matang sempurna tapi tetap lembut",
          "Jangan terlalu kering, angkat saat masih sedikit lembab",
          "Sajikan hangat"
        ],
        minAge: 8,
        maxAge: 18,
        cookingTime: 10,
        nutritionalBenefits: ["Protein tinggi", "Kolin untuk otak", "Vitamin D", "Zat besi"],
        tools: ["Wajan anti lengket", "Spatula", "Mangkuk", "Garpu pengocok"],
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        imageUrl: "/api/placeholder-image/fingerfood",
        source: "IDAI - Panduan Protein Hewani"
      },
      {
        name: "Sup Ayam Makaroni Mini",
        description: "Sup bergizi dengan ayam, sayuran, dan makaroni untuk bayi 10 bulan ke atas",
        ingredients: ["2 sendok makan makaroni mini", "40 gram dada ayam cincang", "2 sendok makan wortel potong kecil", "1 sendok makan jagung manis", "300 ml kaldu ayam tanpa garam", "1 sendok teh minyak zaitun"],
        instructions: [
          "Rebus makaroni terpisah hingga sangat lembut, tiriskan",
          "Panaskan minyak, tumis ayam cincang hingga berubah warna",
          "Tuang kaldu ayam, masukkan wortel dan jagung",
          "Masak hingga sayuran lembut (10-15 menit)",
          "Masukkan makaroni yang sudah direbus",
          "Untuk bayi 10-12 bulan, bisa dihaluskan sedikit. Untuk 12+ bulan, sajikan utuh",
          "Sajikan hangat"
        ],
        minAge: 10,
        maxAge: 18,
        cookingTime: 30,
        nutritionalBenefits: ["Protein hewani", "Karbohidrat", "Vitamin A & C", "Zat besi"],
        tools: ["Panci", "Pisau", "Sendok", "Mangkuk"],
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        imageUrl: "/api/placeholder-image/porridge",
        source: "Kemenkes RI"
      },
      {
        name: "Nugget Ikan Salmon Homemade",
        description: "Nugget ikan salmon buatan sendiri yang sehat dan bergizi",
        ingredients: ["100 gram fillet salmon tanpa duri", "1 butir telur", "3 sendok makan tepung panir", "1 sendok makan wortel parut halus", "1 siung bawang putih haluskan", "Minyak untuk menggoreng"],
        instructions: [
          "Kukus salmon hingga matang, lalu haluskan dengan garpu",
          "Campur salmon dengan telur, wortel parut, dan bawang putih",
          "Bentuk adonan menjadi nugget kecil sesuai ukuran genggaman bayi",
          "Gulingkan dalam tepung panir hingga rata",
          "Goreng dengan minyak sedikit (shallow fry) hingga kecokelatan",
          "Atau bisa dipanggang di oven 180°C selama 15 menit",
          "Dinginkan sebelum disajikan"
        ],
        minAge: 10,
        maxAge: 24,
        cookingTime: 30,
        nutritionalBenefits: ["Omega-3 tinggi", "Protein", "DHA untuk otak", "Vitamin D"],
        tools: ["Kukusan", "Mangkuk", "Wajan/oven", "Garpu"],
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        imageUrl: "/api/placeholder-image/fingerfood",
        source: "IDAI"
      },
      {
        name: "Nasi Merah Tim Hati Ayam",
        description: "Nasi tim dengan hati ayam yang kaya zat besi untuk mencegah anemia",
        ingredients: ["3 sendok makan beras merah", "30 gram hati ayam", "2 sendok makan bayam cincang", "1 sendok makan tomat cincang", "250 ml kaldu ayam", "1 sendok teh minyak zaitun"],
        instructions: [
          "Rendam hati ayam dalam air jeruk nipis 10 menit, cuci bersih",
          "Potong hati ayam sangat kecil-kecil",
          "Campur beras merah, hati ayam, bayam, tomat dalam mangkuk tahan panas",
          "Tuang kaldu, aduk rata",
          "Tim selama 40-45 menit hingga beras dan hati sangat lembut",
          "Haluskan sesuai tekstur yang dibutuhkan",
          "Tambahkan minyak zaitun sebelum disajikan"
        ],
        minAge: 9,
        maxAge: 14,
        cookingTime: 55,
        nutritionalBenefits: ["Zat besi sangat tinggi", "Vitamin A", "Protein", "Mencegah anemia"],
        tools: ["Mangkuk tahan panas", "Panci kukus", "Blender", "Pisau"],
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        imageUrl: "/api/placeholder-image/porridge",
        source: "Kemenkes RI - Pedoman Pencegahan Anemia"
      },
      {
        name: "Pancake Pisang Oat",
        description: "Pancake sehat dari pisang dan oat tanpa tambahan gula",
        ingredients: ["1 buah pisang matang", "1 butir telur", "3 sendok makan oat halus", "1 sendok teh minyak kelapa untuk memasak"],
        instructions: [
          "Haluskan pisang dengan garpu hingga lembut",
          "Tambahkan telur, kocok hingga rata",
          "Masukkan oat halus, aduk hingga tercampur sempurna",
          "Panaskan wajan anti lengket dengan sedikit minyak",
          "Tuang adonan membentuk pancake kecil (sesuai ukuran tangan bayi)",
          "Masak dengan api kecil hingga muncul gelembung, balik",
          "Masak hingga kedua sisi kecokelatan",
          "Dinginkan dan potong sesuai kebutuhan"
        ],
        minAge: 10,
        maxAge: 24,
        cookingTime: 20,
        nutritionalBenefits: ["Serat tinggi", "Energi", "Protein", "Vitamin B"],
        tools: ["Wajan anti lengket", "Spatula", "Mangkuk", "Garpu"],
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        imageUrl: "/api/placeholder-image/fingerfood",
        source: "WHO - Healthy Snacks Guide"
      },
      {
        name: "Pure Daging Sapi dengan Kentang",
        description: "Pure daging sapi dan kentang yang kaya zat besi dan protein",
        ingredients: ["50 gram daging sapi giling (pilih bagian has dalam)", "1 buah kentang ukuran sedang", "150 ml kaldu sapi tanpa garam", "1 sendok teh minyak zaitun"],
        instructions: [
          "Kupas dan potong kentang menjadi dadu kecil",
          "Rebus daging sapi giling dengan sedikit air hingga matang sempurna",
          "Rebus kentang dalam kaldu hingga sangat lembut",
          "Gabungkan daging dan kentang",
          "Blender atau haluskan dengan garpu, tambahkan kaldu jika terlalu kental",
          "Tambahkan minyak zaitun",
          "Sajikan hangat"
        ],
        minAge: 8,
        maxAge: 11,
        cookingTime: 35,
        nutritionalBenefits: ["Zat besi tinggi", "Protein hewani", "Zinc", "Vitamin B12"],
        tools: ["Panci", "Blender", "Pisau", "Saringan"],
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        imageUrl: "/api/placeholder-image/puree",
        source: "IDAI - Panduan Protein Hewani"
      },
      {
        name: "Perkedel Tahu Sayur Mini",
        description: "Perkedel tahu dengan sayuran yang lembut dan bergizi",
        ingredients: ["100 gram tahu putih", "2 sendok makan wortel parut", "1 sendok makan daun bawang iris halus", "1 butir telur", "2 sendok makan tepung terigu", "1 siung bawang putih haluskan", "Minyak untuk menggoreng"],
        instructions: [
          "Hancurkan tahu dengan garpu hingga lembut",
          "Campur tahu dengan wortel parut, daun bawang, telur, tepung, dan bawang putih",
          "Aduk rata hingga semua bahan tercampur",
          "Bentuk adonan menjadi perkedel kecil pipih",
          "Goreng dengan minyak sedikit (shallow fry) hingga kecokelatan",
          "Tiriskan di atas tisu",
          "Dinginkan sebelum disajikan"
        ],
        minAge: 12,
        maxAge: 24,
        cookingTime: 25,
        nutritionalBenefits: ["Protein nabati", "Kalsium", "Vitamin A", "Zat besi"],
        tools: ["Mangkuk", "Wajan", "Garpu", "Parutan"],
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        imageUrl: "/api/placeholder-image/fingerfood",
        source: "Kemenkes RI"
      },
      {
        name: "Bubur Ayam Lengkap",
        description: "Bubur ayam dengan sayuran lengkap untuk bayi 12 bulan ke atas",
        ingredients: ["4 sendok makan beras putih", "50 gram dada ayam cincang", "2 sendok makan wortel potong dadu kecil", "2 sendok makan brokoli cincang", "1 sendok makan jagung manis", "400 ml kaldu ayam", "1 sendok teh minyak wijen"],
        instructions: [
          "Cuci beras dan masak dengan kaldu ayam hingga setengah matang",
          "Tambahkan ayam cincang, masak sambil diaduk",
          "Masukkan wortel dan jagung, masak 10 menit",
          "Tambahkan brokoli, masak hingga semua bahan sangat lembut",
          "Untuk bayi 12-14 bulan, bisa dihaluskan sedikit",
          "Untuk 15+ bulan, tekstur bisa lebih kasar",
          "Tambahkan minyak wijen sebelum disajikan"
        ],
        minAge: 12,
        maxAge: 24,
        cookingTime: 40,
        nutritionalBenefits: ["Gizi lengkap", "Protein", "Vitamin A, C, K", "Serat"],
        tools: ["Panci", "Sendok", "Pisau", "Mangkuk"],
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        imageUrl: "/api/placeholder-image/porridge",
        source: "IDAI"
      }
    ];

    recipesData.forEach((recipeData) => {
      const id = randomUUID();
      const recipe: Recipe = { ...recipeData, id };
      this.recipes.set(id, recipe);
    });
  }

  async getAllRecipes(): Promise<Recipe[]> {
    return Array.from(this.recipes.values());
  }

  async getRecipeById(id: string): Promise<Recipe | undefined> {
    return this.recipes.get(id);
  }

  async getRecipesByIds(ids: string[]): Promise<Recipe[]> {
    const recipes: Recipe[] = [];
    for (const id of ids) {
      const recipe = this.recipes.get(id);
      if (recipe) {
        recipes.push(recipe);
      }
    }
    return recipes;
  }

  async searchRecipes(search: RecipeSearch): Promise<Recipe[]> {
    let results = Array.from(this.recipes.values());

    // Filter by ingredients if provided
    if (search.ingredients && search.ingredients.length > 0) {
      results = results.filter(recipe => {
        const recipeIngredients = recipe.ingredients.join(" ").toLowerCase();
        return search.ingredients!.some(ingredient => 
          recipeIngredients.includes(ingredient.toLowerCase())
        );
      });
    }

    // Filter by age range if provided
    if (search.minAge !== undefined && search.maxAge !== undefined) {
      results = results.filter(recipe => {
        // Recipe is suitable if there's any overlap with the search age range
        return recipe.minAge <= search.maxAge! && recipe.maxAge >= search.minAge!;
      });
    }

    // Filter by cooking time if provided
    if (search.maxCookingTime !== undefined) {
      results = results.filter(recipe => 
        recipe.cookingTime <= search.maxCookingTime!
      );
    }

    return results;
  }

  async getFavorites(sessionId: string): Promise<string[]> {
    const favSet = this.favorites.get(sessionId);
    return favSet ? Array.from(favSet) : [];
  }

  async addFavorite(sessionId: string, recipeId: string): Promise<void> {
    if (!this.recipes.has(recipeId)) {
      throw new Error("Recipe not found");
    }
    
    if (!this.favorites.has(sessionId)) {
      this.favorites.set(sessionId, new Set());
    }
    
    this.favorites.get(sessionId)!.add(recipeId);
  }

  async removeFavorite(sessionId: string, recipeId: string): Promise<void> {
    const favSet = this.favorites.get(sessionId);
    if (favSet) {
      favSet.delete(recipeId);
    }
  }
}

export const storage = new MemStorage();
