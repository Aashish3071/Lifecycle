import { Button } from "@/components/ui/button";

const Navbar = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 bg-hero/80 backdrop-blur-xl border-b border-hero-foreground/10">
    <div className="container mx-auto flex items-center justify-between h-16 px-6">
      <span className="font-display text-xl font-bold text-hero-foreground tracking-tight">
        Lifecycle<span className="text-accent">.</span>
      </span>
      <div className="hidden md:flex items-center gap-8 text-sm text-hero-muted">
        <a href="#problem" className="hover:text-hero-foreground transition-colors">Why Us</a>
        <a href="#workflow" className="hover:text-hero-foreground transition-colors">How It Works</a>
        <a href="#automations" className="hover:text-hero-foreground transition-colors">Automations</a>
        <a href="#integrations" className="hover:text-hero-foreground transition-colors">Integrations</a>
      </div>
      <Button variant="hero" size="sm">Request Early Access</Button>
    </div>
  </nav>
);

export default Navbar;
