export interface MealAnalysisResult {
  title: string;
  estimatedCalories: number;
  detectedItems: string[];
  analyzer: string;
  confidence: number;
  status: string;
}

export async function analyzeMealMock(fileName?: string): Promise<MealAnalysisResult> {
  await new Promise((resolve) => setTimeout(resolve, 600));
  const lower = fileName?.toLowerCase() ?? "";
  const detectedItems =
    lower.includes("salad") || lower.includes("bowl")
      ? ["Chicken", "Avocado", "Leafy greens", "Olive oil"]
      : ["Rice", "Protein", "Vegetables"];

  return {
    title: lower.includes("salad") ? "Chicken avocado salad" : "Balanced meal",
    estimatedCalories: lower.includes("snack") ? 280 : 540,
    detectedItems,
    analyzer: "mock-ai-v1",
    confidence: 0.88,
    status: "reviewed",
  };
}
