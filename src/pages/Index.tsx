import { useState } from "react";
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
import EarlyAccessModal from "@/components/landing/EarlyAccessModal";

const Index = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const openModal = () => setModalOpen(true);

  return (
    <div className="min-h-screen">
      <Navbar onRequestAccess={openModal} />
      <HeroSection onRequestAccess={openModal} />
      <ProblemSection />
      <SolutionSection />
      <WorkflowSection />
      <AutomationsSection />
      <InsightsSection />
      <SimplicitySection />
      <SocialProofSection />
      <IntegrationsSection />
      <CtaSection onRequestAccess={openModal} />
      <Footer />
      <EarlyAccessModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
};

export default Index;
