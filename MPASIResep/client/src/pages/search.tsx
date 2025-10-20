import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Search } from "lucide-react";

export default function SearchPage() {
  const [, setLocation] = useLocation();
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [currentIngredient, setCurrentIngredient] = useState("");
  const [ageRange, setAgeRange] = useState("");
  const [cookingTime, setCookingTime] = useState("");

  const handleAddIngredient = () => {
    if (currentIngredient.trim() && !ingredients.includes(currentIngredient.trim())) {
      setIngredients([...ingredients, currentIngredient.trim()]);
      setCurrentIngredient("");
    }
  };

  const handleRemoveIngredient = (ingredient: string) => {
    setIngredients(ingredients.filter(i => i !== ingredient));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddIngredient();
    }
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (ingredients.length > 0) {
      params.set("ingredients", ingredients.join(","));
    }
    if (ageRange) {
      params.set("age", ageRange);
    }
    if (cookingTime) {
      params.set("time", cookingTime);
    }
    setLocation(`/resep?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-background py-8 md:py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 md:mb-12 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-foreground">
            Cari Resep MPASI
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            Masukkan informasi di bawah untuk menemukan resep yang sesuai
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl md:text-2xl">Bahan yang Tersedia</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="ingredient-input" className="text-base font-semibold">
                Masukkan bahan makanan
              </Label>
              <div className="flex gap-3">
                <Input
                  id="ingredient-input"
                  data-testid="input-ingredient"
                  value={currentIngredient}
                  onChange={(e) => setCurrentIngredient(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Contoh: wortel, ayam, beras"
                  className="h-14 text-lg"
                />
                <Button
                  type="button"
                  onClick={handleAddIngredient}
                  size="lg"
                  className="h-14 px-6"
                  data-testid="button-add-ingredient"
                >
                  <Plus className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {ingredients.length > 0 && (
              <div className="space-y-3">
                <Label className="text-base font-semibold">Bahan yang dipilih</Label>
                <div className="flex flex-wrap gap-2">
                  {ingredients.map((ingredient) => (
                    <Badge
                      key={ingredient}
                      variant="secondary"
                      className="h-10 px-4 text-base gap-2"
                      data-testid={`badge-ingredient-${ingredient}`}
                    >
                      {ingredient}
                      <button
                        onClick={() => handleRemoveIngredient(ingredient)}
                        className="hover-elevate rounded-full"
                        aria-label={`Hapus ${ingredient}`}
                        data-testid={`button-remove-${ingredient}`}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Usia Anak</CardTitle>
            </CardHeader>
            <CardContent>
              <Label htmlFor="age-select" className="text-base font-semibold mb-3 block">
                Pilih rentang usia
              </Label>
              <Select value={ageRange} onValueChange={setAgeRange}>
                <SelectTrigger id="age-select" className="h-14 text-lg" data-testid="select-age">
                  <SelectValue placeholder="Pilih usia anak" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6-8">6-8 bulan</SelectItem>
                  <SelectItem value="9-11">9-11 bulan</SelectItem>
                  <SelectItem value="12-18">12-18 bulan</SelectItem>
                  <SelectItem value="18-24">18-24 bulan</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Waktu Memasak</CardTitle>
            </CardHeader>
            <CardContent>
              <Label htmlFor="time-select" className="text-base font-semibold mb-3 block">
                Berapa lama waktu Anda?
              </Label>
              <Select value={cookingTime} onValueChange={setCookingTime}>
                <SelectTrigger id="time-select" className="h-14 text-lg" data-testid="select-time">
                  <SelectValue placeholder="Pilih waktu memasak" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">Kurang dari 15 menit</SelectItem>
                  <SelectItem value="30">15-30 menit</SelectItem>
                  <SelectItem value="60">30-60 menit</SelectItem>
                  <SelectItem value="999">Lebih dari 1 jam</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </div>

        <Button
          onClick={handleSearch}
          size="lg"
          className="w-full h-14 text-lg font-semibold"
          data-testid="button-search"
        >
          <Search className="w-5 h-5 mr-2" />
          Cari Resep
        </Button>
      </div>
    </div>
  );
}
