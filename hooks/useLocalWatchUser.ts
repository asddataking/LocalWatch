"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { getFingerprintId } from "@/app/utils/fingerprint";

export function useLocalWatchUser() {
  const { isLoaded: clerkLoaded, isSignedIn } = useAuth();
  const ensureUser = useMutation(api.users.ensureUser);
  const [fingerprintId, setFingerprintId] = useState("");
  const [user, setUser] = useState<Doc<"users"> | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setFingerprintId(getFingerprintId());
  }, []);

  useEffect(() => {
    if (!fingerprintId || !clerkLoaded) return;

    let cancelled = false;
    setReady(false);

    ensureUser({ fingerprintId })
      .then((u) => {
        if (!cancelled) {
          setUser(u);
          setError(null);
          setReady(true);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          console.error(err);
          setError("Could not load your profile");
          setReady(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [fingerprintId, clerkLoaded, isSignedIn, ensureUser]);

  return {
    user,
    ready,
    error,
    fingerprintId,
    isRegistered: !!user?.clerkId,
  };
}
