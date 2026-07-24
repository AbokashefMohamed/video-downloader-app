import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setUser, logout, setLoading } from "../store/authSlice";
import { getMe } from "../api/auth";

interface Props {
  children: React.ReactNode;
}

export function AuthInitializer({ children }: Props) {
  const dispatch = useAppDispatch();
  const { token } = useAppSelector((state) => state.auth);
  const initialized = useRef(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // only run once prevent double call in React StrictMode
    if (initialized.current) return;
    initialized.current = true;

    // no token nothing to restore
    if (!token) {
      Promise.resolve().then(() => setReady(true));
      return;
    }

    // token exists verify it's still valid and get fresh user data
    getMe()
      .then((user) => {
        if (!user || !user.id || !user.email) {
          dispatch(logout());
          return;
        }
        dispatch(setUser(user));
      })
      .catch(() => {
        // token expired or invalid clear everything
        dispatch(logout());
      })
      .finally (() => {
        dispatch(setLoading(false));
        setReady(true)
      });
  }, [dispatch, token]);

  // wait until auth is resolved before rendering anything
  if (!ready) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-800 flex items-center justify-center">
        <p className="text-white/60">Loading...</p>
      </div>
    );
  }
  return <>{children}</>;
}
