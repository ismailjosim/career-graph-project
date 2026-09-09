"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  AdminPackageModal,
  PackageCard,
  PricingHeader,
  PurchaseModal,
  TokenEconomyCard,
  type TokenPackageData,
  type TokenTransactionData,
  TokenTransactionsLedger,
} from "@/components/dashboard/pricing";
import { useTokens } from "@/context/tokens-context";
import { confirmAction } from "@/lib/alerts";

export default function PricingPage() {
  const { tokens, refreshTokens, updateTokensLocally } = useTokens();

  const [packages, setPackages] = useState<TokenPackageData[]>([]);
  const [transactions, setTransactions] = useState<TokenTransactionData[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [txLoading, setTxLoading] = useState(true);

  // Modals state
  const [selectedPackage, setSelectedPackage] =
    useState<TokenPackageData | null>(null);
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<TokenPackageData | null>(
    null,
  );

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

  const handlePurchaseSuccess = (newBalance: number) => {
    updateTokensLocally(newBalance);
    refreshTokens();
    fetchTransactions();
    toast.success("Tokens credited successfully to your account!");
  };

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
      {/* Header with Balance & Admin Action */}
      <PricingHeader
        tokens={tokens}
        isAdmin={isAdmin}
        onOpenCreatePackage={handleOpenCreate}
      />

      {/* Transparent Token Economy Explanation */}
      <TokenEconomyCard />

      {/* Packages Section */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Available Token Packages
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Select a token bundle to instantly credit your account. No
            expiration dates.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-96 rounded-2xl bg-slate-100 dark:bg-slate-800/50 animate-pulse border border-slate-200/60 dark:border-slate-700/50"
              />
            ))}
          </div>
        ) : packages.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 text-sm">
            No active token packages available at the moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {packages.map((pkg) => (
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

      {/* Transactions History Ledger */}
      <TokenTransactionsLedger
        transactions={transactions}
        loading={txLoading}
      />

      {/* Purchase Modal */}
      <PurchaseModal
        isOpen={Boolean(selectedPackage)}
        pkg={selectedPackage}
        onClose={() => setSelectedPackage(null)}
        onSuccess={handlePurchaseSuccess}
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
