"use client";

import { Check, Coins, Copy, Mail, Sparkles } from "lucide-react";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  AdminPackageModal,
  PackageCard,
  PaymentReturnWatcher,
  PricingCelebrationModal,
  PricingHeader,
  PurchaseModal,
  TokenEconomyCard,
  type TokenPackageData,
  type TokenTransactionData,
  TokenTransactionsLedger,
} from "@/components/dashboard/pricing";
import { useTokens } from "@/context/tokens-context";
import { confirmAction } from "@/lib/alerts";

export function PricingClient() {
  const { tokens, refreshTokens, updateTokensLocally } = useTokens();

  const [packages, setPackages] = useState<TokenPackageData[]>([]);
  const [transactions, setTransactions] = useState<TokenTransactionData[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [txLoading, setTxLoading] = useState(true);
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Modals state
  const [selectedPackage, setSelectedPackage] =
    useState<TokenPackageData | null>(null);
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<TokenPackageData | null>(
    null,
  );

  // Payment success celebration state
  const [celebration, setCelebration] = useState<{
    tokensAdded: number;
    newBalance: number;
    packageName: string;
  } | null>(null);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText("support@careergraph.com");
      setCopiedEmail(true);
      toast.success("Copied support@careergraph.com to clipboard!");
      setTimeout(() => setCopiedEmail(false), 2500);
    } catch {
      toast.error("Failed to copy. Please write to support@careergraph.com");
    }
  };

  const bundlePackages = useMemo(() => {
    return packages.filter(
      (p) =>
        p.category !== "token_only" && !p.name.toLowerCase().includes("refill"),
    );
  }, [packages]);

  const refillPackages = useMemo(() => {
    return packages.filter(
      (p) =>
        p.category === "token_only" || p.name.toLowerCase().includes("refill"),
    );
  }, [packages]);

  const fetchPackages = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/packages");
      if (res.ok) {
        const data = await res.json();
        setPackages(data.packages || []);
        setIsAdmin(Boolean(data.isAdmin));
      }
    } catch (err) {
      console.error("Failed to load packages:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchTransactions = useCallback(async () => {
    try {
      setTxLoading(true);
      const res = await fetch("/api/packages/transactions");
      if (res.ok) {
        const data = await res.json();
        setTransactions(data.transactions || []);
      }
    } catch (err) {
      console.error("Failed to load token transactions:", err);
    } finally {
      setTxLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPackages();
    fetchTransactions();
  }, [fetchPackages, fetchTransactions]);

  const handleVerifiedPayment = useCallback(
    (newBalance: number, tokensAdded: number, packageName: string) => {
      updateTokensLocally(newBalance);
      refreshTokens();
      fetchTransactions();
      setCelebration({
        newBalance,
        tokensAdded,
        packageName,
      });
      toast.success(
        `Payment successful! Added ${tokensAdded.toLocaleString()} tokens.`,
      );
    },
    [updateTokensLocally, refreshTokens, fetchTransactions],
  );

  const handleOpenCreate = () => {
    setEditingPackage(null);
    setAdminModalOpen(true);
  };

  const handleOpenEdit = (pkg: TokenPackageData) => {
    setEditingPackage(pkg);
    setAdminModalOpen(true);
  };

  const handleDeletePackage = async (pkg: TokenPackageData) => {
    const confirmed = await confirmAction({
      title: "Delete Package?",
      text: `Are you sure you want to delete "${pkg.name}"? Users will no longer see this package in the marketplace.`,
      isDestructive: true,
      confirmButtonText: "Delete Package",
    });

    if (!confirmed) return;

    try {
      const res = await fetch(`/api/packages/${pkg._id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success(`Package "${pkg.name}" deleted successfully!`);
        fetchPackages();
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to delete package");
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to delete package",
      );
    }
  };

  return (
    <div className="w-full space-y-8 animate-fade-in pb-12">
      {/* Suspense-wrapped watcher for Polar Checkout Return */}
      <Suspense fallback={null}>
        <PaymentReturnWatcher onSuccess={handleVerifiedPayment} />
      </Suspense>

      {/* Header with Balance & Admin Action */}
      <PricingHeader
        tokens={tokens}
        isAdmin={isAdmin}
        onOpenCreatePackage={handleOpenCreate}
      />

      {/* Transparent Token Economy Explanation */}
      <TokenEconomyCard />

      {/* Packages Section */}
      <div className="space-y-10">
        {/* 1. All-in-One Career Bundles */}
        <div className="space-y-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/40 text-blue-700 dark:text-blue-400 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Recommended for Job Seekers</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              All-in-One Career Acceleration Bundles
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Includes 30 or 365 Days of automated daily web scraping tailored
              to your target role + Lifetime AI Diamond Tokens.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="h-96 rounded-2xl bg-slate-100 dark:bg-slate-800/50 animate-pulse border border-slate-200/60 dark:border-slate-700/50"
                />
              ))}
            </div>
          ) : bundlePackages.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 text-sm">
              No active bundle packages available at the moment.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
              {bundlePackages.map((pkg) => (
                <PackageCard
                  key={pkg._id}
                  pkg={pkg}
                  isAdmin={isAdmin}
                  onSelect={(p) => setSelectedPackage(p)}
                  onEdit={handleOpenEdit}
                  onDelete={handleDeletePackage}
                />
              ))}
            </div>
          )}
        </div>

        {/* 2. Token-Only Refills (Only in Dashboard) */}
        <div className="space-y-4 pt-8 border-t border-slate-200 dark:border-slate-800">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/25 text-amber-700 dark:text-amber-400 text-xs font-semibold mb-2">
              <Coins className="w-3.5 h-3.5 text-amber-500" />
              <span>Dashboard Exclusive</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Token-Only Refills (No Daily Scraping Delivery)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Just need extra tokens for ATS resume audits and tailored cover
              letters without daily scraping? Top up your balance with zero
              expiration.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="h-80 rounded-2xl bg-slate-100 dark:bg-slate-800/50 animate-pulse border border-slate-200/60 dark:border-slate-700/50"
                />
              ))}
            </div>
          ) : refillPackages.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 text-sm">
              No token refills available at the moment.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch max-w-3xl">
              {refillPackages.map((pkg) => (
                <PackageCard
                  key={pkg._id}
                  pkg={pkg}
                  isAdmin={isAdmin}
                  onSelect={(p) => setSelectedPackage(p)}
                  onEdit={handleOpenEdit}
                  onDelete={handleDeletePackage}
                />
              ))}
            </div>
          )}
        </div>

        {/* 3. Custom Token Purchase & Enterprise Card */}
        <div className="rounded-3xl p-6 sm:p-8 bg-linear-to-r from-slate-900 via-slate-800 to-indigo-950 text-white border border-slate-700/80 shadow-xl space-y-4">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                <Mail className="w-3.5 h-3.5" />
                <span>Custom & High-Volume Packages</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold tracking-tight text-white font-space-grotesk">
                Need a Custom Token Amount or Bulk Discount?
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Looking for a tailored token volume for your university career
                center, coding bootcamp cohort, recruiting agency, or enterprise
                team? Contact our team directly and we&apos;ll configure a
                custom token grant with volume invoicing.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0 w-full lg:w-auto">
              <button
                type="button"
                onClick={handleCopyEmail}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-600 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                {copiedEmail ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied Email!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>Copy support@careergraph.com</span>
                  </>
                )}
              </button>

              <a
                href="mailto:support@careergraph.com?subject=Custom%20Token%20Package%20Inquiry&body=Hello%20Career%20Graph%20Team,%0D%0A%0D%0AI%20would%20like%20to%20inquire%20about%20a%20custom%20token%20package.%0D%0AEstimated%20tokens%20needed:%20%0D%0AAccount%20Email:%20%0D%0AUse%20case:%20"
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Email Us Directly</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Transactions History Ledger */}
      <TokenTransactionsLedger
        transactions={transactions}
        loading={txLoading}
      />

      {/* Purchase Modal (Polar Hosted Checkout flow) */}
      <PurchaseModal
        isOpen={Boolean(selectedPackage)}
        pkg={selectedPackage}
        onClose={() => setSelectedPackage(null)}
      />

      {/* Payment Success Celebration Modal */}
      <PricingCelebrationModal
        celebration={celebration}
        onClose={() => setCelebration(null)}
      />

      {/* Admin Package Create / Edit Modal */}
      {isAdmin && (
        <AdminPackageModal
          isOpen={adminModalOpen}
          packageData={editingPackage}
          onClose={() => {
            setAdminModalOpen(false);
            setEditingPackage(null);
          }}
          onSuccess={fetchPackages}
        />
      )}
    </div>
  );
}
