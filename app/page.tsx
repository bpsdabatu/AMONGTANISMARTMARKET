import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/home/hero";
import { Ticker } from "@/components/home/ticker";
import { ModulesGrid } from "@/components/home/modules-grid";
import { RoleAccess } from "@/components/home/role-access";
import { AnalyticsPreview } from "@/components/home/analytics-preview";
import { TechStack } from "@/components/home/tech-stack";
import { Cta } from "@/components/home/cta";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Ticker />
        <ModulesGrid />
        <RoleAccess />
        <AnalyticsPreview />
        <TechStack />
        <Cta />
      </main>
      <Footer />
    </>
  );
}
