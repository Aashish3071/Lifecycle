const Footer = () => (
  <footer className="py-8 bg-hero border-t border-hero-foreground/10">
    <div className="container mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
      <span className="font-display text-sm font-bold text-hero-foreground tracking-tight">
        Lifecycle<span className="text-accent">.</span>
      </span>
      <p className="text-xs text-hero-muted">
        © {new Date().getFullYear()} Lifecycle. All rights reserved.
      </p>
    </div>
  </footer>
);

export default Footer;
