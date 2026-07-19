import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppDispatch } from "../store/hooks";
import { setCredentials } from "../store/authSlice";
import { login } from "../api/auth";
import { Button } from "../components/ui/button";

export function LoginPage() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError("Email is required.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(trimmedEmail)) {
      setError(t("auth.invalidEmail"));
      return;
    }

    if (!password) {
      setError("Password is required.");
      return;
    }
    setLoading(true);

    try {
      const data = await login({ email: trimmedEmail, password });
      dispatch(setCredentials({ user: data.user, token: data.token }));
      navigate("/");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(t("common.error"));
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 w-full max-w-md">
        {/* title */}
        <h1 className="text-2xl font-bold text-white mb-1">
          {t("auth.loginTitle")}
        </h1>
        <p className="text-white/60 mb-6">{t("auth.loginSubtitle")}</p>

        {/* error message */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/30 text-red-200 rounded-lg p-3 mb-4 text-sm">
            {error}
          </div>
        )}

        {/* form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-white/80 text-sm">{t("auth.email")}</label>
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder:text-white/40 focus:outline-none focus:border-white/50"
              placeholder="email@example.com"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-white/80 text-sm">
              {t("auth.password")}
            </label>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder:text-white/40 focus:outline-none focus:border-white/50"
              placeholder="••••••••"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-purple-600 hover:bg-white/90 font-semibold mt-2"
          >
            {loading ? t("common.loading") : t("auth.loginButton")}
          </Button>
        </form>

        {/* register link */}
        <p className="text-white/60 text-sm text-center mt-6">
          {t("auth.noAccount")}{" "}
          <Link
            to="/register"
            className="text-white font-semibold hover:underline"
          >
            {t("auth.signUp")}
          </Link>
        </p>
      </div>
    </div>
  );
}
