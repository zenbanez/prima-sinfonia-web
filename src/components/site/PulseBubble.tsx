"use client";

import { useEffect } from "react";

// The floating Pulse chat bubble (lower right) on every public page, so
// visitors can explore first and ask when they're ready. It's removed again
// when the visitor leaves the public site for the portal.
export function PulseBubble({ tenantId }: { tenantId: string }) {
  useEffect(() => {
    if (!tenantId) return;
    if (document.querySelector('script[data-prima-bubble="true"]')) return;

    const script = document.createElement("script");
    script.src = "https://cdn.pulsemessages.com/widget.js";
    script.async = true;
    script.setAttribute("data-client-id", tenantId);
    script.setAttribute("data-mode", "bubble");
    script.setAttribute("data-prima-bubble", "true");
    document.body.appendChild(script);

    return () => {
      script.remove();
      document.getElementById("pulse-messages-root")?.remove();
    };
  }, [tenantId]);

  return null;
}
