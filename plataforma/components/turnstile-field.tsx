"use client";

import Script from "next/script";
import { useCallback, useEffect, useRef, useState } from "react";

type TurnstileApi = {
  render: (
    element: HTMLElement,
    options: {
      sitekey: string;
      callback: (token: string) => void;
      "expired-callback": () => void;
      "error-callback": () => void;
      "timeout-callback": () => void;
    }
  ) => string;
  remove: (widgetId: string) => void;
  reset: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

type Status = "loading" | "waiting" | "verified" | "expired" | "error";

export default function TurnstileField({
  siteKey,
  submitLabel,
}: {
  siteKey: string;
  submitLabel: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [token, setToken] = useState("");
  const [status, setStatus] = useState<Status>("loading");

  const renderWidget = useCallback(() => {
    if (!containerRef.current || widgetIdRef.current || !window.turnstile) return;

    try {
      setStatus("waiting");
      const widgetId = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        callback: (newToken) => {
          setToken(newToken);
          setStatus("verified");
        },
        "expired-callback": () => {
          setToken("");
          setStatus("expired");
        },
        "timeout-callback": () => {
          setToken("");
          setStatus("expired");
        },
        "error-callback": () => {
          setToken("");
          setStatus("error");
        },
      });
      widgetIdRef.current = widgetId;
    } catch {
      setToken("");
      setStatus("error");
    }
  }, [siteKey]);

  useEffect(() => {
    // Também funciona ao voltar para a página com o script já carregado.
    renderWidget();

    return () => {
      if (widgetIdRef.current) {
        try {
          window.turnstile?.remove(widgetIdRef.current);
        } catch {
          // O widget pode já ter sido removido durante a navegação.
        }
        widgetIdRef.current = null;
      }
    };
  }, [renderWidget]);

  const descriptions: Record<Status, string> = {
    loading: "Carregando a verificação de segurança...",
    waiting: "Aguarde a conclusão da verificação Cloudflare.",
    verified: "Verificação de segurança concluída. Você já pode continuar.",
    expired: "A verificação expirou. Atualize o desafio para continuar.",
    error: "Não foi possível carregar ou concluir o Turnstile. Verifique se o navegador bloqueia challenges.cloudflare.com.",
  };

  function retry() {
    const id = widgetIdRef.current;
    if (id && window.turnstile) {
      setToken("");
      setStatus("waiting");
      window.turnstile.reset(id);
    } else {
      window.location.reload();
    }
  }

  return (
    <div className="turnstile-field">
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onReady={renderWidget}
        onError={() => setStatus("error")}
      />
      <div ref={containerRef} className="turnstile-widget" aria-label="Verificação de segurança Cloudflare Turnstile" />
      <input type="hidden" name="cf-turnstile-response" value={token} />
      <p className="turnstile-message" role="status" aria-live="polite">{descriptions[status]}</p>
      {(status === "error" || status === "expired") && (
        <button type="button" className="btn btn-secondary turnstile-retry" onClick={retry}>
          Tentar verificação novamente
        </button>
      )}
      <button className="btn" type="submit" disabled={!token}>
        {submitLabel}
      </button>
    </div>
  );
}
