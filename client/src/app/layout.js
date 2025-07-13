import "./globals.css";
import { Inter } from "next/font/google";
import ThemeProvider from "@/components/ui/theme-provider";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "SustainaCart",
  description: "Eco-friendly ecommerce",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <Head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme');
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else if (theme === 'light') {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </Head>
      <body className={`${inter.className} bg-background text-foreground`}>
        <ThemeProvider>
          {/* Optional: Theme toggle button */}
          {/* <div className="absolute top-4 right-4 z-50">
            <ThemeToggle />
          </div> */}
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
