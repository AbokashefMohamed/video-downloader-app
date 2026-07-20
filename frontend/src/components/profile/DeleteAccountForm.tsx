import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";

interface Props {
  onDelete: (password: string) => Promise<void>;
}

export function DeleteAccountForm({ onDelete }: Props) {
  const { t } = useTranslation();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // validate password before opening the confirmation dialog
  function handleOpenChange() {
    setError(null);
    if (!password) {
      setError(t("auth.password") + " is required.");
      return false;
    }
    return true;
  }

  async function handleConfirmDelete() {
    setLoading(true);
    try {
      await onDelete(password);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-red-500/10 backdrop-blur-md border border-red-500/20 rounded-2xl p-6">
      <h2 className="text-red-300 font-semibold mb-2">
        {t("profile.deleteAccount")}
      </h2>
      <p className="text-white/50 text-sm mb-4">
        {t("profile.deleteAccountConfirm")}
      </p>

      {error && (
        <div className="bg-red-500/20 border border-red-500/30 text-red-200 rounded-lg p-3 mb-4 text-sm">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-white/80 text-sm">{t("auth.password")}</label>
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(null);
            }}
            placeholder="••••••••"
            className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder:text-white/40 focus:outline-none focus:border-white/50"
          />
        </div>

        <AlertDialog>
          <AlertDialogTrigger>
            <Button
              type="button"
              disabled={loading || !password}
              onClick={() => handleOpenChange()}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold disabled:opacity-50"
            >
              {loading ? t("common.loading") : t("profile.deleteAccount")}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t("profile.deleteAccount")}</AlertDialogTitle>
              <AlertDialogDescription>
                {t("profile.deleteConfirm")}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmDelete}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                {t("profile.deleteAccount")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}