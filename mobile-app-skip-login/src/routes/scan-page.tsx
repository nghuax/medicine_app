import { zodResolver } from "@hookform/resolvers/zod";
import { Camera, Search, Sparkles } from "lucide-react";
import { useId, useState, type ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { AppFrame } from "@shared/components/mobile/app-frame";
import { BottomNav } from "@shared/components/mobile/bottom-nav";
import { CameraScanner } from "@shared/components/ui/camera-scanner";
import { Button } from "@shared/components/ui/button";
import { Card } from "@shared/components/ui/card";
import { InputField } from "@shared/components/ui/input";
import { SegmentedControl } from "@shared/components/ui/segmented-control";
import { useAppData } from "@shared/data/app-provider";
import { z } from "zod";

const barcodeSchema = z.object({
  barcode: z.string().min(6, "Enter or scan a barcode."),
});

export function ScanPage() {
  const { analyzeMeal, lookupBarcode, state } = useAppData();
  const [tab, setTab] = useState<"meal" | "barcode">("meal");
  const [productBarcode, setProductBarcode] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const mealUploadId = useId();
  const meal = state.scannedMeals[0] ?? null;
  const product = state.products.find((entry) => entry.barcode === productBarcode) ?? null;
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<z.infer<typeof barcodeSchema>>({
    defaultValues: { barcode: "" },
    resolver: zodResolver(barcodeSchema),
  });

  async function handleMealUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    setIsAnalyzing(true);
    await analyzeMeal(file.name);
    setIsAnalyzing(false);
  }

  async function handleBarcodeSubmit(values: z.infer<typeof barcodeSchema>) {
    const matched = await lookupBarcode(values.barcode, "mobile");
    setProductBarcode(matched?.barcode ?? values.barcode);
  }

  return (
    <AppFrame bottomNav={<BottomNav />}>
      <div className="section-stack">
        <h1 className="text-[30px] font-extrabold text-[var(--text)]">Scan</h1>
        <p className="support-copy">Use the meal analyzer or product barcode scanner to understand what supports your plan.</p>
      </div>

      <SegmentedControl
        ariaLabel="Scan mode"
        onChange={(value) => setTab(value as "meal" | "barcode")}
        options={[
          { label: "Meal photo", value: "meal" },
          { label: "Barcode", value: "barcode" },
        ]}
        value={tab}
      />

      {tab === "meal" ? (
        <div className="space-y-4">
          <Card tone="surface">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="icon-badge bg-[var(--lime-100)] text-[var(--lime-700)]">
                  <Sparkles size={18} />
                </span>
                <div>
                  <div className="text-lg font-extrabold text-[var(--text)]">AI calorie scan</div>
                  <div className="text-sm text-[var(--muted)]">Mock analyzer shipped with clean TODO points for future AI integration.</div>
                </div>
              </div>
              <label
                className="field-shell flex cursor-pointer flex-col items-center gap-3 px-6 py-8 text-center focus-within:border-[var(--lime-500)]"
                htmlFor={mealUploadId}
              >
                <Camera size={26} />
                <span className="text-sm font-semibold text-[var(--text)]">{isAnalyzing ? "Analyzing..." : "Upload meal photo"}</span>
                <span className="text-xs text-[var(--muted)]">JPG or PNG works well in this demo analyzer.</span>
                <input
                  accept="image/png,image/jpeg,image/webp"
                  className="sr-only"
                  id={mealUploadId}
                  onChange={handleMealUpload}
                  type="file"
                />
              </label>
            </div>
          </Card>
          {meal ? (
            <Card tone="mint">
              <div className="space-y-3">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">Latest result</div>
                <div className="text-xl font-extrabold text-[var(--text)]">{meal.title}</div>
                <div className="text-[34px] font-extrabold leading-none text-[var(--text)]">{meal.estimatedCalories} kcal</div>
                <div className="flex flex-wrap gap-2">
                  {meal.detectedItems.map((item) => (
                    <span className="pill pill-white" key={item}>
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </Card>
          ) : null}
        </div>
      ) : (
        <div className="space-y-4">
          <CameraScanner
            label="Product barcode scanner"
            onDetected={(value) => {
              setValue("barcode", value);
              void lookupBarcode(value, "mobile").then((matched) => setProductBarcode(matched?.barcode ?? value));
            }}
          />
          <Card tone="surface">
            <form className="space-y-4" onSubmit={handleSubmit(handleBarcodeSubmit)}>
              <InputField
                error={errors.barcode?.message}
                helper="Manual lookup is available if camera permissions are unavailable."
                label="Barcode"
                placeholder="893850000001"
                {...register("barcode")}
              />
              <Button type="submit">
                <Search size={18} />
                Look up product
              </Button>
            </form>
          </Card>
          {product ? (
            <Card tone="surface">
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="text-lg font-extrabold text-[var(--text)]">{product.name}</div>
                  <div className="text-sm text-[var(--muted)]">Scanned barcode: {product.barcode}</div>
                </div>
                <div className="grid gap-4 min-[400px]:grid-cols-[104px_1fr]">
                  <div className="rounded-[28px] bg-[#131d33] px-6 py-8 text-center text-white">Matched</div>
                  <div className="space-y-3">
                    <div className="text-[34px] font-extrabold leading-none text-[var(--text)]">{product.calories} kcal</div>
                    <div className="flex flex-wrap gap-2">
                      {product.avoidItems.slice(0, 2).map((item) => (
                        <span className="pill pill-soft" key={item}>
                          {item}
                        </span>
                      ))}
                    </div>
                    <Link className="text-sm font-bold text-[var(--lime-700)]" to={`/scan/product/${product.barcode}`}>
                      Open product insight
                    </Link>
                  </div>
                </div>
              </div>
            </Card>
          ) : productBarcode ? (
            <Card tone="peach">
              <div className="space-y-2">
                <div className="text-lg font-extrabold text-[var(--text)]">No product matched</div>
                <div className="text-sm text-[var(--muted)]">You can still add this barcode from the admin dashboard.</div>
              </div>
            </Card>
          ) : null}
        </div>
      )}
    </AppFrame>
  );
}
