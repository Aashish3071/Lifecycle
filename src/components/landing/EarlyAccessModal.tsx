import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { z } from "zod";

const emailSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address").max(255),
  name: z.string().trim().min(1, "Please enter your name").max(100),
});

interface EarlyAccessModalProps {
  open: boolean;
  onClose: () => void;
}

const EarlyAccessModal = ({ open, onClose }: EarlyAccessModalProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = emailSchema.safeParse({ name, email });
    if (!result.success) {
      const fieldErrors: { name?: string; email?: string } = {};
      result.error.errors.forEach((err) => {
        if (err.path[0] === "name") fieldErrors.name = err.message;
        if (err.path[0] === "email") fieldErrors.email = err.message;
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    toast.success("You're on the list! We'll be in touch soon.");
    setName("");
    setEmail("");
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        >
          <div className="absolute inset-0 bg-foreground/50 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25 }}
            className="relative bg-card rounded-2xl border border-border shadow-2xl w-full max-w-md p-8"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-secondary flex items-center justify-center hover:bg-muted transition-colors"
            >
              <X className="w-4 h-4 text-muted-foreground" />
            </button>

            <h3 className="font-display text-2xl font-bold text-foreground">Request Early Access</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Be among the first to turn your customer data into smarter marketing decisions.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <Input
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-secondary border-border"
                  maxLength={100}
                />
                {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
              </div>
              <div>
                <Input
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-secondary border-border"
                  maxLength={255}
                />
                {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
              </div>
              <Button type="submit" variant="hero" size="lg" className="w-full text-base">
                Get Early Access
              </Button>
            </form>

            <p className="mt-4 text-[11px] text-muted-foreground text-center">
              No spam. We'll only reach out when it's your turn.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EarlyAccessModal;
