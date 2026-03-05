import { Button } from "@/components/ui/button";

const scrollTo = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
};

interface NavbarProps {
  onRequestAccess: () => void;
}

const Navbar = ({ onRequestAccess }: NavbarProps) => (
  <nav className="fixed top-0 left-0 right-0 z-50 bg-hero/80 backdrop-blur-xl border-b border-hero-foreground/10">
    <div className="container mx-auto flex items-center justify-between h-16 px-6">
      <span className="font-display text-xl font-bold text-hero-foreground tracking-tight">
        Lifecycle<span className="text-accent">.</span>
      </span>
      <div className="hidden md:flex items-center gap-8 text-sm text-hero-muted">
        <button onClick={() => scrollTo("problem")} className="hover:text-hero-foreground transition-colors">Why Us</button>
        <button onClick={() => scrollTo("workflow")} className="hover:text-hero-foreground transition-colors">How It Works</button>
        <button onClick={() => scrollTo("automations")} className="hover:text-hero-foreground transition-colors">Automations</button>
        <button onClick={() => scrollTo("integrations")} className="hover:text-hero-foreground transition-colors">Integrations</button>
      </div>
      <Button variant="hero" size="sm" onClick={onRequestAccess}>Request Early Access</Button>
    </div>
  </nav>
);

export default Navbar;
