import Link from "next/link";
import ThemeProvider from "@/components/theme-provider";
import ThemeStatus from "@/components/theme-status";
import "./global.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light">
      <body>
        <ThemeProvider>
          <header>
            <p>== Root Layout Header ==</p>
            <nav>
              <Link href="/">Home</Link> | <Link href="/counter">Counter</Link><br />
              Slug Page Menu :&nbsp;
              <Link href="/nextjs">nextjs</Link>&nbsp;&nbsp;
              <Link href="/routing">routing</Link>&nbsp;&nbsp;
              <Link href="/ssr-sg">ssr-sge</Link>&nbsp;&nbsp;
              <Link href="/dynamic-routes">dynamic-routes</Link><br />
              # interleaving 예제 : <Link href="/interleaved">interleaving 예제</Link>
            </nav>
            <ThemeStatus />
          </header>
          <main>
            {children}
          </main>
          <footer>== Root Layout Footer ==</footer>
        </ThemeProvider>
      </body>
    </html>
  );
}