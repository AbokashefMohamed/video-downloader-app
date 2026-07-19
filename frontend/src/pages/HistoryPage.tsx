import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getHistory, deleteHistoryEntry, clearHistory } from "../api/history";
import { HistoryEntry } from "../types";
import { Button } from "../components/ui/button";
import { HistoryCard } from "../components/history/HistoryCard";

export function HistoryPage() {
  const { t } = useTranslation();
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // fetch history when page loads
  useEffect(() => {
    async function fetchHistory() {
      try {
        setError(null);
        const data = await getHistory();
        // Fallback to empty array if API returns null or undefined values
        setHistory(Array.isArray(data) ? data : []);
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, []);

  // delete a single entry and remove it from the list
  async function handleDelete(id: string) {
    if (!id) return;
    try {
      setError(null);
      await deleteHistoryEntry(id);
      setHistory((prev) => prev.filter((entry) => entry._id !== id));
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
    }
  }

  // clear all history entries
  async function handleClearAll() {
    const confirmed = window.confirm(t("history.confirmClearAll", "Are you sure you want to delete all history?"));
    if (!confirmed) return;
    try {
      setError(null);
      await clearHistory();
      setHistory([]);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-white/60">{t("common.loading")}</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">

      {/* header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">{t("history.title")}</h1>
        {history.length > 0 && (
          <Button
            variant="outline"
            onClick={handleClearAll}
            className="border-red-400/30 text-red-300 hover:bg-red-500/10"
          >
            {t("history.clearAll")}
          </Button>
        )}
      </div>

      {/* error */}
      {error && (
        <div className="bg-red-500/20 border border-red-500/30 text-red-200 rounded-lg p-3 mb-4 text-sm">
          {error}
        </div>
      )}

      {/* empty state */}
      {history.length === 0 && !error && (
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-12 text-center">
          <p className="text-white/40 text-lg">{t("history.empty")}</p>
        </div>
      )}

      {/* history list — each entry rendered by HistoryCard */}
      <div className="flex flex-col gap-3">
        {history.map((entry) => (
          <HistoryCard
            key={entry._id}
            entry={entry}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}