/**
 * ClerkProvider Component
 * Provides authentication context using Clerk
 */

import React, { ReactNode } from 'react';
import { ClerkProvider as ClerkAuthProvider, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';

// Clerk publishable key from environment variables (using Vite's syntax)
const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || '';

interface ClerkProviderProps {
  children: ReactNode;
}

/**
 * ClerkProvider component that wraps the application to provide authentication
 */
export const ClerkProvider: React.FC<ClerkProviderProps> = ({ children }) => {
  // For development purposes, if the key is missing, simply render children without authentication
  if (!CLERK_PUBLISHABLE_KEY) {
    console.warn('Missing Clerk publishable key. Using development mode without authentication.');
    return <>{children}</>;
  }

  return (
    <ClerkAuthProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      {children}
    </ClerkAuthProvider>
  );
};

/**
 * Component that only renders children if user is authenticated,
 * otherwise redirects to sign-in
 */
export const AuthenticatedRoute: React.FC<{ children: ReactNode }> = ({ children }) => {
  // If no Clerk key is present, consider all routes authenticated for development purposes
  if (!CLERK_PUBLISHABLE_KEY) {
    return <>{children}</>;
  }
  
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
};

export default ClerkProvider;
