"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthUser, Role, getUser } from "./auth";

export function useRequireAuth(expectedRole: Role) {
  const router = useRouter();
  const [user, setUserState] = useState<AuthUser | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const u = getUser();
    if (!u) {
      router.replace(`/login?role=${expectedRole}`);
      return;
    }
    setUserState(u);
    setChecked(true);

    function onAuthChange() {
      setUserState(getUser());
    }
    window.addEventListener("FureverCare-auth-updated", onAuthChange);
    return () =>
      window.removeEventListener("FureverCare-auth-updated", onAuthChange);
  }, [expectedRole, router]);

  const roleMismatch = !!user && user.role !== expectedRole;

  return { user, checked, roleMismatch };
}
