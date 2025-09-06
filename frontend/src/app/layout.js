import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { GameProvider } from "@/contexts/GameContext";
import QueryProvider from "@/contexts/QueryContext";
import { DatabaseListener } from "@/hooks/useDatabaseListener";
import ToasterComponent from "@/contexts/Toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Murder Mystery Detective",
  description: "Solve mysteries with AI-powered detective gameplay",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <QueryProvider>
            <GameProvider>
              <DatabaseListener>
                {children}
                <ToasterComponent />
              </DatabaseListener>
            </GameProvider>
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
