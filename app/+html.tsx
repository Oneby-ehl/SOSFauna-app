import { ScrollViewStyleReset } from "expo-router/html";
import type { ReactNode } from "react";

export default function Root({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <meta name="robots" content="noindex,nofollow" />
        <meta name="theme-color" content="#14532d" />
        <link rel="manifest" href="/manifest.json" />
        <link
          rel="apple-touch-icon"
          href="/icons/icon-192.png"
        />
        <ScrollViewStyleReset />
      </head>
      <body>
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker.register('/sw.js', {
      scope: '/'
    });
  });
}
            `,
          }}
        />
      </body>
    </html>
  );
}
