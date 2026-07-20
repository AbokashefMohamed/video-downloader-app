import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../ui/button";
import { UpdateProfileDto } from "../../types";

interface Props {
  currentName: string;
  onUpdate: (data: UpdateProfileDto) => Promise<void>;
}

export function UpdateProfileForm({ currentName, onUpdate }: Props) {
  const { t } = useTranslation();

  const [name, setName] = useState(currentName);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // only send fields that actually changed
    const data: UpdateProfileDto = {};
    if (name.trim() && name.trim() !== currentName) {
      if (name.trim().length < 2) {
        setError(t("auth.nameRequired"));
        return;
      }
      if (name.trim().length > 50) {
        setError("Name must be 50 characters or less.");
        return;
      }
      data.name = name.trim();
    }
    if (currentPassword || newPassword) {
      if (!currentPassword) {
        setError(t("auth.currentPassword") + " is required.");
        return;
      }
      if (!newPassword) {
        setError(t("auth.newPassword") + " is required.");
        return;
      }
      if (newPassword.length < 8) {
        setError(t("auth.passwordTooShort"));
        return;
      }
      if (!/[A-Z]/.test(newPassword)) {
        setError(
          t(
            "auth.passwordNeedsUppercase",
            "Password must contain at least one uppercase letter.",
          ),
        );
        return;
      }
      if (!/[0-9]/.test(newPassword)) {
        setError(
          t(
            "auth.passwordNeedsNumber",
            "Password must contain at least one number.",
          ),
        );
        return;
      }
      if (!/[^a-zA-Z0-9]/.test(newPassword)) {
        setError(
          t(
            "auth.passwordNeedsSymbol",
            "Password must contain at least one symbol.",
          ),
        );
        return;
      }
      data.currentPassword = currentPassword;
      data.newPassword = newPassword;
    }

    // nothing changed no point calling the API
    if (Object.keys(data).length === 0) {
      setError("No changes detected.");
      return;
    }

    setLoading(true);
    try {
      await onUpdate(data);
      setSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
      <h2 className="text-white font-semibold mb-4">{t("profile.title")}</h2>

      {success && (
        <div className="bg-green-500/20 border border-green-500/30 text-green-200 rounded-lg p-3 mb-4 text-sm">
          ✓ {t("profile.save")}
        </div>
      )}

      {error && (
        <div className="bg-red-500/20 border border-red-500/30 text-red-200 rounded-lg p-3 mb-4 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-white/80 text-sm">{t("auth.name")}</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder:text-white/40 focus:outline-none focus:border-white/50"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-white/80 text-sm">
            {t("auth.currentPassword")}
          </label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="••••••••"
            className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder:text-white/40 focus:outline-none focus:border-white/50"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-white/80 text-sm">
            {t("auth.newPassword")}
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="••••••••"
            className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder:text-white/40 focus:outline-none focus:border-white/50"
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="bg-white text-purple-600 hover:bg-white/90 font-semibold"
        >
          {loading ? t("common.loading") : t("profile.save")}
        </Button>
      </form>
    </div>
  );
}
