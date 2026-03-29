import { useEffect, useEffectEvent, useRef, useState } from "react";
import { ScanLine } from "lucide-react";
import { Button } from "@shared/components/ui/button";
import { Card } from "@shared/components/ui/card";

interface CameraScannerProps {
  label: string;
  onDetected: (value: string) => void;
}

export function CameraScanner({ label, onDetected }: CameraScannerProps) {
  const [active, setActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState("Scanner idle");
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const handleDetected = useEffectEvent(onDetected);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!active || !videoElement) {
      return;
    }

    let canceled = false;
    let controls: { stop: () => void } | null = null;
    let stopReader = false;

    async function startScanner() {
      try {
        setError(null);
        setStatus("Preparing camera...");
        const { BrowserMultiFormatReader } = await import("@zxing/browser");
        if (canceled) {
          return;
        }

        const reader = new BrowserMultiFormatReader();
        const devices = await BrowserMultiFormatReader.listVideoInputDevices();
        if (canceled) {
          return;
        }

        const device = devices[0];
        if (!device) {
          setError("No camera was detected in this browser.");
          setActive(false);
          return;
        }

        setStatus("Point the camera at a barcode.");
        controls = await reader.decodeFromVideoDevice(
          device.deviceId,
          videoElement as HTMLVideoElement,
          (result) => {
            if (result && !canceled) {
              const text = result.getText();
              handleDetected(text);
              setStatus(`Detected ${text}`);
              setActive(false);
              controls?.stop();
            } else if (!result && !stopReader) {
              setStatus("Point the camera at a barcode.");
            }
          },
        );
      } catch (scannerError) {
        setError(scannerError instanceof Error ? scannerError.message : "Unable to start the camera.");
        setActive(false);
      }
    }

    void startScanner();

    return () => {
      canceled = true;
      stopReader = true;
      controls?.stop();
    };
  }, [active]);

  return (
    <Card className="overflow-hidden" tone="soft">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <span className="icon-badge bg-[var(--lime-100)] text-[var(--lime-700)]">
            <ScanLine size={18} />
          </span>
          <div>
            <div className="text-sm font-extrabold text-[var(--text)]">{label}</div>
            <div aria-live="polite" className="text-xs text-[var(--muted)]">
              {status}
            </div>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-[26px] bg-[#131d33]">
          <video aria-hidden="true" className="aspect-[16/10] w-full object-cover" muted playsInline ref={videoRef} />
          {!active ? (
            <div className="absolute inset-0 flex items-center justify-center bg-[rgba(19,29,51,0.68)] px-6 text-center text-sm font-semibold text-white">
              Start camera scanning when you are ready.
            </div>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-3">
          <Button fullWidth={false} onClick={() => setActive((value) => !value)} variant={active ? "secondary" : "primary"}>
            {active ? "Stop camera" : "Start camera"}
          </Button>
          {error ? <span className="self-center text-xs font-medium text-[var(--danger)]">{error}</span> : null}
        </div>
      </div>
    </Card>
  );
}
