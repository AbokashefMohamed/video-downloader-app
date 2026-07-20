import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setUser, logout } from "../store/authSlice";
import { getMe } from "../api/auth";

interface Props {
  children: React.ReactNode;
}

export function AuthInitializer({ children }: Props) {
  const dispatch = useAppDispatch();
  const { token } = useAppSelector((state) => state.auth);
  const initialized = useRef(false);

  useEffect(() => {
    // only run once prevent double call in React StrictMode
    if (initialized.current) return;
    initialized.current = true;

    // no token nothing to restore
    if (!token) return;

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
      });
  }, [dispatch, token]);

  return <>{children}</>;
}