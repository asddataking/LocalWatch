"use client";

import { useAuth } from "@clerk/nextjs";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";
import { useRef } from "react";

export function ConvexClientProvider({ children }: { children: React.ReactNode }) {
  const clientRef = useRef<ConvexReactClient | null>(null);
  if (!clientRef.current) {
    const url = process.env.NEXT_PUBLIC_CONVEX_URL || "https://fast-parakeet-214.convex.cloud";
    clientRef.current = new ConvexReactClient(url);
  }
  return (
    <ConvexProviderWithClerk client={clientRef.current} useAuth={useAuth}>
      {children}
    </ConvexProviderWithClerk>
  );
}
