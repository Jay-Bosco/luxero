export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Admin pages have their own header, so we don't use the main site layout
  return (
    <div className="min-h-screen bg-luxury-black">
      {children}
    </div>
  );
}
