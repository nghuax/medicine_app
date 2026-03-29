import { useId, useState, type ChangeEvent } from "react";
import { AdminShell } from "@shared/components/admin/admin-shell";
import { Button } from "@shared/components/ui/button";
import { Card } from "@shared/components/ui/card";
import { EmptyState } from "@shared/components/ui/empty-state";
import { Pill } from "@shared/components/ui/pill";
import { useAppData } from "@shared/data/app-provider";
import { productSchema } from "@shared/lib/validators";

interface ParsedRow {
  index: number;
  issue: string | null;
  product: {
    barcode: string;
    name: string;
    brand: string;
    category: string;
    servingSize: string;
    calories: number;
    sugarGrams: number;
    caffeineMg: number;
    status: string;
    warningText?: string;
    alternativeText?: string;
    reminderNote?: string;
    avoidItems: string[];
    stock: number;
    source: string;
  } | null;
}

export function ImportPage() {
  const { importProducts, state } = useAppData();
  const [rows, setRows] = useState<ParsedRow[]>([]);
  const [isParsing, setIsParsing] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputId = useId();

  async function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    setIsParsing(true);
    try {
      const buffer = await file.arrayBuffer();
      const XLSX = await import("xlsx");
      const workbook = XLSX.read(buffer, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: "" });

      const parsed = json.map((entry, index) => {
        const result = productSchema.safeParse({
          barcode: entry.barcode ?? entry.Barcode ?? "",
          name: entry.name ?? entry.Product ?? "",
          brand: entry.brand ?? entry.Brand ?? "Clinic import",
          category: entry.category ?? entry.Category ?? "Tablet",
          servingSize: entry.servingSize ?? entry.ServingSize ?? "1 unit",
          calories: entry.calories ?? entry.Calories ?? 0,
          sugarGrams: entry.sugarGrams ?? entry.Sugar ?? 0,
          caffeineMg: entry.caffeineMg ?? entry.Caffeine ?? 0,
          status: entry.status ?? entry.Status ?? "review",
          warningText: entry.warningText ?? entry.Warning ?? "",
          alternativeText: entry.alternativeText ?? entry.Alternative ?? "",
          reminderNote: entry.reminderNote ?? entry.Reminder ?? "",
          avoidItems: entry.avoidItems ?? entry.Avoid ?? "",
          stock: entry.stock ?? entry.Stock ?? 0,
        });

        if (!result.success) {
          return {
            index: index + 2,
            issue: result.error.issues[0]?.message ?? "Needs review",
            product: null,
          };
        }

        return {
          index: index + 2,
          issue: null,
          product: {
            ...result.data,
            avoidItems: result.data.avoidItems ? result.data.avoidItems.split(",").map((value) => value.trim()).filter(Boolean) : [],
            source: "excel-import",
          },
        };
      });

      setRows(parsed);
    } finally {
      setIsParsing(false);
    }
  }

  async function handleImport() {
    const valid = rows.flatMap((row) => (row.product ? [row.product] : []));
    if (valid.length === 0) {
      return;
    }
    setIsImporting(true);
    await importProducts(valid);
    setIsImporting(false);
  }

  return (
    <AdminShell
      description="Validate Excel rows before publishing new product records, and keep scanner history visible for fast correction."
      title="Import"
    >
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_420px]">
        <div className="grid gap-6">
          <Card tone="surface">
            <div className="space-y-5">
              <div className="text-[24px] font-extrabold text-[var(--text)]">Upload Excel sheet</div>
              <label
                className="field-shell flex cursor-pointer flex-col items-center gap-3 px-6 py-10 text-center focus-within:border-[var(--lime-500)]"
                htmlFor={fileInputId}
              >
                <span className="text-sm font-semibold text-[var(--text)]">{isParsing ? "Parsing spreadsheet..." : "Choose `.xlsx` or `.csv`"}</span>
                <span className="text-xs text-[var(--muted)]">Columns like `barcode`, `name`, `brand`, and `stock` work well.</span>
                <input accept=".xlsx,.csv" className="sr-only" id={fileInputId} onChange={handleFile} type="file" />
              </label>
              {rows.length === 0 ? (
                <EmptyState description="No import rows loaded yet. Upload a spreadsheet to preview validation." title="Waiting for import" />
              ) : (
                <div className="space-y-3">
                  <div className="table-header grid-cols-[70px_1.2fr_1fr_120px] text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                    <span>Row</span>
                    <span>Product</span>
                    <span>Issue</span>
                    <span>Action</span>
                  </div>
                  {rows.map((row) => (
                    <div className="table-row" key={row.index}>
                      <span className="font-extrabold text-[var(--text)]" data-label="Row">
                        {row.index}
                      </span>
                      <span className="text-sm text-[var(--text)]" data-label="Product">
                        {row.product?.name ?? "Invalid row"}
                      </span>
                      <span className="text-sm text-[var(--muted)]" data-label="Issue">
                        {row.issue ?? "Ready to import"}
                      </span>
                      <span data-label="Action">
                        <Pill tone={row.issue ? "soft" : "lime"}>{row.issue ? "Needs fix" : "Ready"}</Pill>
                      </span>
                    </div>
                  ))}
                </div>
              )}
              <Button disabled={isParsing || isImporting} onClick={() => void handleImport()}>
                {isImporting ? "Importing..." : "Import valid rows"}
              </Button>
            </div>
          </Card>

          <Card tone="surface">
            <div className="space-y-4">
              <div className="text-[24px] font-extrabold text-[var(--text)]">Import review</div>
              <div className="text-sm text-[var(--muted)]">Validate Excel rows before publishing to customers.</div>
            </div>
          </Card>
        </div>

        <Card tone="surface">
          <div className="space-y-5">
            <div className="text-[24px] font-extrabold text-[var(--text)]">Scanner history</div>
            <div className="space-y-3">
              {state.barcodeScans.slice(0, 8).map((scan) => (
                <div className="rounded-[20px] bg-[rgba(245,247,240,0.92)] px-4 py-4" key={scan._id}>
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-extrabold text-[var(--text)]">{scan.barcode}</div>
                      <div className="text-xs text-[var(--muted)]">{scan.source}</div>
                    </div>
                    <Pill tone={scan.resultStatus === "matched" ? "lime" : "soft"}>{scan.resultStatus}</Pill>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </AdminShell>
  );
}
