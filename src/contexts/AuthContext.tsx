import { createContext, useContext, useState, ReactNode } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  user: { name: string; email: string; avatar?: string } | null;
  setupComplete: boolean;
  onboardingComplete: boolean;
  onboardingDismissed: boolean;
  signIn: () => void;
  signOut: () => void;
  completeSetup: () => void;
  completeOnboarding: () => void;
  dismissOnboarding: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [setupComplete, setSetupComplete] = useState(false);
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const [onboardingDismissed, setOnboardingDismissed] = useState(false);

  const user = isAuthenticated
    ? { name: "User", email: "user@lifecycle.io", avatar: undefined }
    : null;

  const signIn = () => setIsAuthenticated(true);
  const signOut = () => {
    setIsAuthenticated(false);
    setSetupComplete(false);
    setOnboardingComplete(false);
    setOnboardingDismissed(false);
  };
  const completeSetup = () => setSetupComplete(true);
  const completeOnboarding = () => setOnboardingComplete(true);
  const dismissOnboarding = () => setOnboardingDismissed(true);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        setupComplete,
        onboardingComplete,
        onboardingDismissed,
        signIn,
        signOut,
        completeSetup,
        completeOnboarding,
        dismissOnboarding,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
