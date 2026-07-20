import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { logout } from "../../store/authSlice";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

// available languages the user can switch between
const LANGUAGES = [
  { code: "en", label: "EN" },
  { code: "ar", label: "AR" },
  { code: "sv", label: "SV" },
  { code: "it", label: "IT" },
  { code: "es", label: "ES" },
  { code: "fr", label: "FR" },
];

export function Navbar() {
  const { t, i18n } = useTranslation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  // log out and redirect to home
  function handleLogout() {
    dispatch(logout());
    navigate("/");
  }

  // switch language and update html dir for RTL support
  function handleLanguageChange(code: string | null) {
    if (code) {
      i18n.changeLanguage(code);
    }
  }

  // generates initials from a user's name for the avatar
  function getInitials(name?: string): string {
    if (!name) return "U";
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return parts[0].slice(0, 2).toUpperCase();
  }

  return (
    <nav className="bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* logo */}
        <Link to="/" className="text-white font-bold text-xl shrink-0">
          <span className="hidden sm:inline">🎬 VideoDL</span>
          <span className="sm:hidden">🎬</span>
        </Link>

        {/* navigation links */}
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="text-white/80 hover:text-white transition-colors"
          >
            {t("nav.home")}
          </Link>

          {isAuthenticated && (
            <Link
              to="/history"
              className="text-white/80 hover:text-white transition-colors"
            >
              {t("nav.history")}
            </Link>
          )}

          {isAuthenticated && user?.role === "admin" && (
            <Link
              to="/admin"
              className="text-white/80 hover:text-white transition-colors"
            >
              {t("nav.admin")}
            </Link>
          )}
        </div>

        {/* language switcher dropdown */}
        <Select value={i18n.language} onValueChange={handleLanguageChange}>
          <SelectTrigger className="w-[65px] border-white/30 text-white bg-white/10 hover:bg-white/20 h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-purple-900 border-white/20 min-w-[65px]">
            {LANGUAGES.map((lang) => (
              <SelectItem
                key={lang.code}
                value={lang.code}
                className="text-white hover:bg-white/10 focus:bg-white/20 cursor-pointer"
              >
                {lang.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* auth buttons */}
        {isAuthenticated ? (
          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <button className="size-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold tracking-wider outline outline-1 outline-white/20 shadow-md">
                  {getInitials(user?.name)}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {/* shows who is logged in */}
                <div className="px-2 py-1.5 text-sm font-medium text-gray-900">
                  {user?.name}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => navigate("/profile")}
                  className="cursor-pointer"
                >
                  {t("nav.settings", "Settings")}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-600 cursor-pointer"
                >
                  {t("nav.logout")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/login">
              <Button
                variant="outline"
                size="sm"
                className="border-white/30 text-black hover:bg-white/10"
              >
                {t("nav.login")}
              </Button>
            </Link>
            <Link to="/register" className="hidden sm:block">
              <Button
                size="sm"
                className="bg-white text-purple-600 hover:bg-white/90"
              >
                {t("nav.register")}
              </Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
