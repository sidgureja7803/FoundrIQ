/**
 * Credit Guard Component
 * Higher-order component to restrict access to submission functionality when credits are depleted
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PaywallModal from './PaywallModal';
import { useAuth } from '../../hooks/useAuth';

// Demo credit data - would come from API in real app
const DEMO_USER_CREDITS = {
  availableCredits: 3,
  totalCredits: 5,
  usedCredits: 2
};

interface CreditGuardProps {
  children: React.ReactNode;
  requiredCredits?: number;
}

const CreditGuard: React.FC<CreditGuardProps> = ({ 
  children, 
  requiredCredits = 1 
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showPaywall, setShowPaywall] = useState(false);
  const [availableCredits, setAvailableCredits] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch user credits on component mount
  useEffect(() => {
    const fetchCredits = async () => {
      // This would be an API call in a real application
      // For demo purposes, we're using the constant DEMO_USER_CREDITS
      setIsLoading(true);
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        setAvailableCredits(DEMO_USER_CREDITS.availableCredits);
      } catch (error) {
        console.error('Failed to fetch user credits', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchCredits();
    }
  }, [user]);

  // Check if user has enough credits when they visit this page
  useEffect(() => {
    if (!isLoading && availableCredits < requiredCredits) {
      setShowPaywall(true);
    }
  }, [availableCredits, requiredCredits, isLoading]);

  const handleCreditPurchase = async (packageId: string) => {
    // This would be an API call to process payment in a real application
    
    // For demo purposes, we'll simulate a successful purchase
    console.log(`Processing purchase for package: ${packageId}`);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Find the package and update available credits
    const creditPackages = [
      { id: 'basic', credits: 5 },
      { id: 'pro', credits: 15 },
      { id: 'business', credits: 50 }
    ];
    
    const selectedPackage = creditPackages.find(pkg => pkg.id === packageId);
    
    if (selectedPackage) {
      setAvailableCredits(prev => prev + selectedPackage.credits);
      setShowPaywall(false);
    }
  };

  // If we're still loading credits data, show a loading indicator
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      {/* Show the paywall if user doesn't have enough credits */}
      <PaywallModal 
        isOpen={showPaywall} 
        onClose={() => navigate('/dashboard')} 
        onPurchase={handleCreditPurchase} 
      />
      
      {/* Only render children (the submission form) if user has enough credits */}
      {!showPaywall && children}
    </>
  );
};

export default CreditGuard;
