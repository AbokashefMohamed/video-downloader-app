import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppDispatch } from "../store/hooks";
import { setCredentials } from "../store/authSlice";
import { register } from "../api/auth";
import { Button } from "../components/ui/button";

export function RegisterPage() {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      setError(t("auth.nameRequired"));
      return;
    }
    if (!/\S+@\S+\.\S+/.test(trimmedEmail)) {
      setError(t("auth.invalidEmail"));
      return;
    }

    if (password.length < 8) {
      setError(t("auth.passwordTooShort"));
      return;
    }

    setLoading(true);
    try {
      const data = await register({ 
        name: trimmedName, 
        email: trimmedEmail, 
        password });

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
          {t("auth.registerTitle")}
        </h1>
        <p className="text-white/60 mb-6">{t("auth.registerSubtitle")}</p>

        {/* error message */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/30 text-red-200 rounded-lg p-3 mb-4 text-sm">
            {error}
          </div>
        )}

        {/* form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-white/80 text-sm">{t("auth.name")}</label>
            <input
              type="text"
              value={name}
              minLength={2}
              maxLength={50}
              onChange={(e) => setName(e.target.value)}
              required
              className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder:text-white/40 focus:outline-none focus:border-white/50"
              placeholder="John Doe"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-white/80 text-sm">{t("auth.email")}</label>
            <input
              type="email"
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
              minLength={8}
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
            {loading ? t("common.loading") : t("auth.registerButton")}
          </Button>
        </form>

        {/* login link */}
        <p className="text-white/60 text-sm text-center mt-6">
          {t("auth.haveAccount")}{" "}
          <Link
            to="/login"
            className="text-white font-semibold hover:underline"
          >
            {t("auth.signIn")}
          </Link>
        </p>
      </div>
    </div>
  );
}
