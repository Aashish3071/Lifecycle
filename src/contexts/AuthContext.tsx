import { createContext, useContext, useState, ReactNode } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  user: { name: string; email: string; avatar?: string } | null;
  onboardingComplete: boolean;
  onboardingDismissed: boolean;
  signIn: () => void;
  signOut: () => void;
  completeOnboarding: () => void;
  dismissOnboarding: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [onboardingDismissed, setOnboardingDismissed] = useState(false);

  const user = isAuthenticated
    ? { name: "Alex Johnson", email: "alex@lifecycle.io", avatar: undefined }
    : null;

  const signIn = () => setIsAuthenticated(true);
  const signOut = () => {
    setIsAuthenticated(false);
    setOnboardingComplete(false);
    setOnboardingDismissed(false);
  };
  const completeOnboarding = () => setOnboardingComplete(true);
  const dismissOnboarding = () => setOnboardingDismissed(true);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, onboardingComplete, onboardingDismissed, signIn, signOut, completeOnboarding, dismissOnboarding }}
    >
      {children}
    </AuthContext.Provider>
  );
};
