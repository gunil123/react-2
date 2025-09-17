export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <header>=== Root Layout ===</header>
      <main>{children}</main>
      <footer>=== Root Layout ===</footer>
    </html>
  );
}
