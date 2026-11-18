"use client";

import { useEffect } from "react";
import { site } from "@/content/site";

export function EnquireForm({ tenantId }: { tenantId: string }) {
  useEffect(() => {
    if (!tenantId) return;
    if (document.querySelector(`script[data-client-id="${tenantId}"][data-container="prima-enquire-root"]`)) {
      return;
    }

    const script = document.createElement("script");
    script.src = "https://cdn.pulsemessages.com/widget.js";
    script.async = true;
    script.setAttribute("data-client-id", tenantId);
    script.setAttribute("data-mode", "contact");
    script.setAttribute("data-container", "prima-enquire-root");
    script.setAttribute("data-heading", site.enquire.pulseHeading);
    script.setAttribute("data-subheading", site.enquire.pulseSubheading);
    script.setAttribute("data-placeholder", site.enquire.pulsePlaceholder);
    script.setAttribute("data-button-text", site.enquire.pulseButtonText);
    script.setAttribute("data-accent-color", site.enquire.pulseAccentColor);
    document.body.appendChild(script);

    return () => {
      script.remove();
    };
  }, [tenantId]);

  if (!tenantId) {
    return (
      <div className="space-y-4 rounded-2xl border border-[var(--site-border)] bg-[var(--site-surface)] p-6 shadow-sm">
        <p className="text-lg font-semibold text-[var(--site-ink)]">
          Enquiry form coming soon.
        </p>
        <p className="text-sm leading-relaxed text-[var(--site-ink-muted)]">
          Our online enquiry form is being connected now. In the meantime, please message Prima
          Sinfonia directly on Facebook with your details.
        </p>
        <a
          href={site.facebookUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center rounded-xl bg-[var(--site-primary)] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--site-primary-hover)]"
        >
          Message Prima Sinfonia on Facebook
        </a>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[var(--site-border)] bg-[var(--site-surface)] p-6 shadow-sm">
      <div id="prima-enquire-root" className="min-h-[420px]" />
    </div>
  );
}
