import Link from 'next/link';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header>
          <nav>
            {/* Prefetched when the link is hovered or enters the viewport */}
            <Link href="/">Home</Link> | <Link href="/blog">Blog</Link> |
            <a href="https://google.com">Google with a tag</a> |
            <a href="/blog" target="_blank">Blog with a tag</a> <br />
            <Link href="/blog2">Blog2</Link> | <Link href="/blog2/nextjs">Slug - nextjs</Link>
          </nav>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}