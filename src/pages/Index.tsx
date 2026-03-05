import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import ProblemSection from "@/components/landing/ProblemSection";
import SolutionSection from "@/components/landing/SolutionSection";
import WorkflowSection from "@/components/landing/WorkflowSection";
import AutomationsSection from "@/components/landing/AutomationsSection";
import InsightsSection from "@/components/landing/InsightsSection";
import SimplicitySection from "@/components/landing/SimplicitySection";
import IntegrationsSection from "@/components/landing/IntegrationsSection";
import CtaSection from "@/components/landing/CtaSection";
import Footer from "@/components/landing/Footer";

const Index = () => (
  <div className="min-h-screen">
    <Navbar />
    <HeroSection />
    <ProblemSection />
    <SolutionSection />
    <WorkflowSection />
    <AutomationsSection />
    <InsightsSection />
    <SimplicitySection />
    <IntegrationsSection />
    <CtaSection />
    <Footer />
  </div>
);

export default Index;
