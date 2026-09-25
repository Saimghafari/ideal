"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { logout } from "@/store/reducer/authReducer";

/**
 * Clears persisted Redux auth when the session cookie is missing/expired,
 * so the header does not show a profile avatar for logged-out visitors.
 */
const AuthSessionSync = () => {
  const dispatch = useDispatch();
  const auth = useSelector((store) => store.authStore.auth);

  useEffect(() => {
    if (!auth) return;

    let cancelled = false;

    const sync = async () => {
      try {
        const { data } = await axios.get("/api/auth/me");
        if (!cancelled && !data?.success) {
          dispatch(logout());
        }
      } catch {
        if (!cancelled) {
          dispatch(logout());
        }
      }
    };

    sync();

    return () => {
      cancelled = true;
    };
  }, [auth, dispatch]);

  return null;
};

export default AuthSessionSync;
