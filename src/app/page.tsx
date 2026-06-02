import { AboutSection } from "@/components/AboutSection";
import { CashflowPreviewTool } from "@/components/CashflowPreviewTool";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/HeroSection";
import { LinkButtonList } from "@/components/LinkButtonList";
import { ServiceCards } from "@/components/ServiceCards";
import { SocialLinks } from "@/components/SocialLinks";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.22),transparent_32%),radial-gradient(circle_at_85%_20%,rgba(251,191,36,0.2),transparent_28%),linear-gradient(135deg,#fffaf0_0%,#eefcf6_48%,#f8fafc_100%)]" />
      <HeroSection />
      <ServiceCards />
      <LinkButtonList />
      <AboutSection />
      <CashflowPreviewTool />
      <SocialLinks />
      <Footer />
    </main>
  );
}
