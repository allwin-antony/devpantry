export default function FontsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Fontshare CDN preload for typography playground */}
      <link
        rel="stylesheet"
        href="https://api.fontshare.com/v2/css?f[]=satoshi@400,700&f[]=clash-display@400,600,700&f[]=general-sans@400,600&f[]=cabinet-grotesk@400,700&display=swap"
      />
      {children}
    </>
  );
}
