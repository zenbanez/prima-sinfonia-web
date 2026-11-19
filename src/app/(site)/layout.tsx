import { PulseBubble } from "@/components/site/PulseBubble";
import { SiteFooter } from "@/components/site/SiteFooter";
import { SiteHeader } from "@/components/site/SiteHeader";
import { getPulseTenantId } from "@/content/site";
import "./site.css";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="site-shell flex min-h-screen flex-col">
      <SiteHeader />
      <main className="site-main flex-1">{children}</main>
      <SiteFooter />
      <PulseBubble tenantId={getPulseTenantId()} />
    </div>
  );
}
