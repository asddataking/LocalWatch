"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { useRef } from "react";

export function ConvexClientProvider({ children }: { children: React.ReactNode }) {
  const clientRef = useRef<ConvexReactClient | null>(null);
  if (!clientRef.current) {
    const url = process.env.NEXT_PUBLIC_CONVEX_URL || "https://fast-parakeet-214.convex.cloud";
    clientRef.current = new ConvexReactClient(url);
  }
  return <ConvexProvider client={clientRef.current}>{children}</ConvexProvider>;
}
