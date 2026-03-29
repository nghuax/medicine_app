import { zodResolver } from "@hookform/resolvers/zod";
import { PackagePlus, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AdminShell } from "@shared/components/admin/admin-shell";
import { CameraScanner } from "@shared/components/ui/camera-scanner";
import { Button } from "@shared/components/ui/button";
import { Card } from "@shared/components/ui/card";
import { InputField, TextareaField } from "@shared/components/ui/input";
import { Pill } from "@shared/components/ui/pill";
import { useAppData } from "@shared/data/app-provider";
import { productSchema } from "@shared/lib/validators";

type ProductFormValues = z.input<typeof productSchema>;
type ProductFormOutput = z.output<typeof productSchema>;

export function ProductsPage() {
  const { state, addProduct } = useAppData();
  const [query, setQuery] = useState("");
  const [scannedBarcode, setScannedBarcode] = useState("");
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues, undefined, ProductFormOutput>({
    defaultValues: {
      barcode: "",
      name: "",
      brand: "",
      category: "Tablet",
      servingSize: "1 tablet",
      calories: 0,
      sugarGrams: 0,
      caffeineMg: 0,
      status: "active",
      warningText: "",
      alternativeText: "",
      reminderNote: "",
      avoidItems: "",
      stock: 50,
    },
    resolver: zodResolver(productSchema),
  });

  const filteredProducts = useMemo(
    () =>
      state.products.filter((product) => {
        const search = query.trim().toLowerCase();
        if (!search) {
          return true;
        }
        return (
          product.name.toLowerCase().includes(search) ||
          product.brand.toLowerCase().includes(search) ||
          product.barcode.includes(search)
        );
      }),
    [query, state.products],
  );

  const selectedProduct = filteredProducts[0] ?? state.products[0] ?? null;

  async function onSubmit(values: ProductFormOutput) {
    await addProduct({
      barcode: values.barcode,
      name: values.name,
      brand: values.brand,
      category: values.category,
      servingSize: values.servingSize,
      calories: values.calories,
      sugarGrams: values.sugarGrams,
      caffeineMg: values.caffeineMg,
      status: values.status,
      warningText: values.warningText || undefined,
      alternativeText: values.alternativeText || undefined,
      reminderNote: values.reminderNote || undefined,
      avoidItems: values.avoidItems ? values.avoidItems.split(",").map((entry) => entry.trim()).filter(Boolean) : [],
      stock: values.stock,
      source: scannedBarcode ? "scanner" : "manual",
    });
  }

  return (
    <AdminShell
      description="Product records, barcode capture, avoid-consume notes, and operational stock context in one place."
      title="Products"
    >
      <div className="page-stack">
        <Card className="hero-panel" tone="surface">
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div className="section-stack">
              <div className="section-kicker">Catalog overview</div>
              <div className="text-[28px] font-extrabold leading-tight text-[var(--text)]">
                Keep product records clean enough for barcode lookup, reminders, and customer safety notes.
              </div>
              <p className="hero-copy">
                Search the active catalog, review avoid-consume guidance, and add new products without
                leaving the same workspace.
              </p>
            </div>
            <div className="grid gap-3 min-[480px]:grid-cols-3 lg:min-w-[360px]">
              <div className="metric-chip">
                <div className="section-kicker">Products</div>
                <div className="text-[28px] font-extrabold leading-none text-[var(--text)]">{state.products.length}</div>
              </div>
              <div className="metric-chip">
                <div className="section-kicker">Scanner logs</div>
                <div className="text-[28px] font-extrabold leading-none text-[var(--text)]">{state.barcodeScans.length}</div>
              </div>
              <div className="metric-chip">
                <div className="section-kicker">Active items</div>
                <div className="text-[28px] font-extrabold leading-none text-[var(--text)]">
                  {state.products.filter((product) => product.status === "active").length}
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_420px]">
          <div className="grid gap-6">
            <Card className="section-stack" tone="surface">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div className="section-stack">
                  <div className="section-kicker">Product search</div>
                  <div className="text-[24px] font-extrabold text-[var(--text)]">Find products and review care notes</div>
                </div>
                <Pill>{filteredProducts.length} results</Pill>
              </div>
              <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
                <div className="space-y-4 rounded-[28px] bg-[rgba(245,247,240,0.96)] p-5">
                  <div aria-label="Product search" className="flex items-center justify-between gap-4" role="search">
                    <div className="field-shell flex min-h-14 flex-1 items-center gap-3 px-4">
                      <label className="sr-only" htmlFor="products-search">
                        Search products
                      </label>
                      <Search size={18} />
                      <input
                        id="products-search"
                        aria-label="Search products"
                        className="w-full border-0 bg-transparent text-sm font-semibold outline-none"
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Search products or barcodes"
                        type="search"
                        value={query}
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    {filteredProducts.map((product) => (
                      <div className="table-row" key={product._id}>
                        <span className="font-extrabold text-[var(--text)]" data-label="Product">
                          {product.name}
                        </span>
                        <span className="text-sm text-[var(--muted)]" data-label="Reminder">
                          {product.reminderNote ?? "No reminder note"}
                        </span>
                        <span className="text-sm text-[var(--muted)]" data-label="Avoid">
                          {product.avoidItems[0] ?? "None"}
                        </span>
                        <span data-label="Status">
                          <Pill tone={product.status === "active" ? "lime" : "soft"}>{product.status}</Pill>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                {selectedProduct ? (
                  <Card tone="surface">
                    <div className="section-stack">
                      <div className="flex items-start gap-4">
                        <span className="icon-badge bg-[var(--lime-100)] text-[var(--lime-700)]">
                          <PackagePlus size={18} />
                        </span>
                        <div>
                          <div className="section-kicker">Selected product</div>
                          <div className="text-[22px] font-extrabold text-[var(--text)]">{selectedProduct.name}</div>
                          <div className="text-sm text-[var(--muted)]">Barcode: {selectedProduct.barcode}</div>
                          <div className="mt-2">
                            <Pill>{selectedProduct.status}</Pill>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="rounded-[20px] bg-[rgba(245,247,240,0.92)] px-4 py-4">
                          <div className="section-kicker">Dose schedule</div>
                          <div className="mt-2 text-sm font-bold text-[var(--text)]">{selectedProduct.reminderNote ?? "08:00 AM • 08:00 PM"}</div>
                        </div>
                        <div className="rounded-[20px] bg-[rgba(245,247,240,0.92)] px-4 py-4">
                          <div className="section-kicker">Customer note</div>
                          <div className="mt-2 text-sm font-bold text-[var(--text)]">{selectedProduct.warningText}</div>
                        </div>
                        <div className="rounded-[20px] bg-[rgba(245,247,240,0.92)] px-4 py-4">
                          <div className="section-kicker">Avoid consume</div>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {selectedProduct.avoidItems.map((item) => (
                              <Pill key={item} tone="soft">
                                {item}
                              </Pill>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ) : null}
              </div>
            </Card>

            <Card className="section-stack" tone="surface">
              <div className="section-stack">
                <div className="section-kicker">Manual entry</div>
                <div className="text-[24px] font-extrabold text-[var(--text)]">Add product manually</div>
                <p className="support-copy">
                  Use this form when scanner or spreadsheet data still needs a curated product record.
                </p>
              </div>
              <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
                <InputField error={errors.barcode?.message} label="Barcode" {...register("barcode")} />
                <InputField error={errors.name?.message} label="Product name" {...register("name")} />
                <InputField error={errors.brand?.message} label="Brand" {...register("brand")} />
                <InputField error={errors.category?.message} label="Category" {...register("category")} />
                <InputField error={errors.servingSize?.message} label="Serving size" {...register("servingSize")} />
                <InputField error={errors.status?.message} label="Status" {...register("status")} />
                <InputField error={errors.calories?.message} label="Calories" type="number" {...register("calories")} />
                <InputField error={errors.sugarGrams?.message} label="Sugar (g)" type="number" {...register("sugarGrams")} />
                <InputField error={errors.caffeineMg?.message} label="Caffeine (mg)" type="number" {...register("caffeineMg")} />
                <InputField error={errors.stock?.message} label="Stock" type="number" {...register("stock")} />
                <TextareaField className="md:col-span-2" label="Warning" {...register("warningText")} />
                <TextareaField className="md:col-span-2" label="Alternative" {...register("alternativeText")} />
                <TextareaField className="md:col-span-2" label="Reminder note" {...register("reminderNote")} />
                <InputField
                  className="md:col-span-2"
                  error={errors.avoidItems?.message}
                  helper="Comma separated values"
                  label="Avoid items"
                  {...register("avoidItems")}
                />
                <div className="md:col-span-2">
                  <Button disabled={isSubmitting} type="submit">
                    Save product
                  </Button>
                </div>
              </form>
            </Card>
          </div>

          <CameraScanner
            label="Add product via barcode scanner"
            onDetected={(value) => {
              setScannedBarcode(value);
              setValue("barcode", value);
            }}
          />
        </div>
      </div>
    </AdminShell>
  );
}
