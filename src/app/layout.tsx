import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "ProviderX Playbook Comercial",
  description: "Sistema comercial ProviderX/Cariap para produtos white-label.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
