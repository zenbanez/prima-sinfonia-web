import { AuthProvider } from "@/context/AuthContext";
import { PORTAL_NOINDEX_METADATA } from "@/content/site";

export const dynamic = "force-dynamic";
export const metadata = PORTAL_NOINDEX_METADATA;

export default function PortalRouteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AuthProvider>{children}</AuthProvider>;
}
