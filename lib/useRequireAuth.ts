"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Role } from "./auth";

export function useRequireAuth(expectedRole: Role) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace(`/login?role=${expectedRole}`);
    }
  }, [status, expectedRole, router]);

  const user = session?.user as any;
  const roleMismatch = user?.role && user.role !== expectedRole;

  return { 
    user: user || null, 
    checked: status !== "loading", 
    roleMismatch 
  };
}
