"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface PaymentReturnWatcherProps {
  onSuccess: (
    newBalance: number,
    tokensAdded: number,
    packageName: string,
  ) => void;
}

export function PaymentReturnWatcher({ onSuccess }: PaymentReturnWatcherProps) {
  const searchParams = useSearchParams();
  const checkoutId = searchParams.get("checkout_id");
  const status = searchParams.get("status");
  const [processed, setProcessed] = useState(false);

  useEffect(() => {
    if (!checkoutId || status !== "success" || processed) return;

    setProcessed(true);
    const toastId = toast.loading("Verifying your payment with Polar...");

    fetch(`/api/packages/verify-checkout?checkout_id=${checkoutId}`)
      .then((res) => res.json())
      .then((data) => {
        toast.dismiss(toastId);
        if (data.success) {
          onSuccess(data.newBalance, data.tokensAdded, data.packageName);
        } else {
          toast.error(data.error || "Payment verification failed.");
        }
      })
      .catch((err) => {
        toast.dismiss(toastId);
        toast.error("Failed to verify payment with Polar.");
        console.error(err);
      })
      .finally(() => {
        if (typeof window !== "undefined") {
          window.history.replaceState(
            {},
            document.title,
            window.location.pathname,
          );
        }
      });
  }, [checkoutId, status, processed, onSuccess]);

  return null;
}
