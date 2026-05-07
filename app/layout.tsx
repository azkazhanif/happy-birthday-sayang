import type { Metadata } from "next";
import "./globals.css";
import { poppins } from "@/lib/font";
import { SceneProvider } from "@/contexts/SceneContext";


export const metadata: Metadata = {
  title: "Happy Birthday, My Love!",
  description: "A special birthday surprise for my lovely girlfriend. Enjoy the experience! ❤️",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`h-full antialiased ${poppins.className}`}
    >
      <body className="min-h-full flex flex-col bg-white">
        <SceneProvider>{children}</SceneProvider>
      </body>
    </html>
  );
}
