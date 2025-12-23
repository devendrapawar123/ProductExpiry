// src/components/BarcodeScanner.jsx
import React, { useState, useEffect } from "react";
// yaha pe * as import liya hai taaki chahe default ho ya named export, dono handle ho jaaye
import * as QRScannerLib from "react-qr-barcode-scanner";

// library compatibility: kuch versions named export dete hain, kuch default
const ScannerComp =
  QRScannerLib.BarcodeScannerComponent || QRScannerLib.default || QRScannerLib;

export default function BarcodeScanner({ onDetected, onClose }) {
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);
  const [lastText, setLastText] = useState("");

  // Camera + permission check
  useEffect(() => {
    async function checkCamera() {
      if (
        typeof navigator === "undefined" ||
        !navigator.mediaDevices ||
        !navigator.mediaDevices.getUserMedia
      ) {
        setError("Camera not supported on this browser / device.");
        return;
      }

      try {
        console.log("[Scanner] requesting camera for test…");
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        });
        // Test ke baad camera band
        stream.getTracks().forEach((t) => t.stop());
        console.log("[Scanner] camera access OK");
        setReady(true);
      } catch (err) {
        console.error("[Scanner] getUserMedia error:", err);
        if (err?.name === "NotAllowedError") {
          setError(
            "Camera permission blocked. Edge/Chrome me URL ke left side lock icon se camera Allow karo."
          );
        } else {
          setError("Unable to access camera: " + err.message);
        }
      }
    }

    checkCamera();
  }, []);

  const handleUpdate = (err, result) => {
    if (err) {
      // "no code found" type errors ko ignore
      // console.log("[Scanner] onUpdate error:", err);
      return;
    }

    if (result?.text) {
      console.log("✅ Barcode detected:", result.text);
      if (result.text !== lastText) {
        setLastText(result.text);
        if (typeof onDetected === "function") {
          onDetected(result.text);
        }
        // agar scan ke turant baad modal band karna ho to:
        // onClose && onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
      <div className="bg-slate-900 rounded-xl w-[95%] max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-2 border-b border-slate-700">
          <h2 className="text-sm font-semibold text-white">
            Scan Product Barcode
          </h2>
          <button
            onClick={onClose}
            className="text-slate-300 text-lg hover:text-red-400"
          >
            ✕
          </button>
        </div>

        <div className="p-3 flex flex-col items-center gap-3">
          <div className="w-full max-w-xs h-72 border-2 border-blue-500 rounded-lg overflow-hidden bg-black flex items-center justify-center">
            {error && (
              <p className="text-red-400 text-xs px-2 text-center">{error}</p>
            )}

            {!error && !ready && (
              <p className="text-slate-300 text-xs px-2 text-center">
                Initializing camera...
              </p>
            )}

            {!error && ready && ScannerComp && (
              <ScannerComp
                // numeric width/height -> zyada stable
                width={320}
                height={320}
                onUpdate={handleUpdate}
              />
            )}

            {!error && ready && !ScannerComp && (
              <p className="text-red-400 text-xs px-2 text-center">
                Scanner component load nahi ho raha. Console me check karein:
                <br />
                <code>import * as m from "react-qr-barcode-scanner"; console.log(m);</code>
              </p>
            )}
          </div>

          <p className="text-[11px] text-slate-300 text-center">
            Barcode ko frame ke beech me rakho. Light thodi bright rakho.
          </p>

          {lastText && (
            <p className="text-[11px] text-emerald-300 text-center">
              Last detected: <span className="font-mono">{lastText}</span>
            </p>
          )}

          <button
            onClick={onClose}
            className="mt-1 px-4 py-1.5 rounded bg-slate-800 text-xs text-white"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
