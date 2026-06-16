import { ClerkProvider } from "@clerk/nextjs";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <ClerkProvider afterSignOutUrl="/">{children}</ClerkProvider>;
}
