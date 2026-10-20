import Footer from "@/components/layout/footer";

/** Every case study ends on the same footer as the rest of the site, with the
    site's 75px minimum gap above it. */
export default function WorkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <div aria-hidden className="h-[75px]" />
      <Footer />
    </>
  );
}
