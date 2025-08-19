import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Deal } from '../types/deals';
import { useNotifications } from './NotificationContext';
import { useAuth } from './AuthContext';

interface DealsContextType {
  deals: Deal[];
  addDeal: (deal: Omit<Deal, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateDeal: (dealId: string, updates: Partial<Deal>) => void;
  deleteDeal: (dealId: string) => void;
  getDealsByAgent: (agentName: string) => Deal[];
  getDealsStats: () => {
    totalDeals: number;
    totalRevenue: number;
    avgDealSize: number;
    closedDeals: number;
  };
}

const DealsContext = createContext<DealsContextType | undefined>(undefined);

export const useDeals = () => {
  const context = useContext(DealsContext);
  if (context === undefined) {
    throw new Error('useDeals must be used within a DealsProvider');
  }
  return context;
};

interface DealsProviderProps {
  children: ReactNode;
}

export const DealsProvider: React.FC<DealsProviderProps> = ({ children }) => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const { addNotification } = useNotifications();
  const { user } = useAuth();

  // Load deals from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('deals');
    if (stored) {
      try {
        setDeals(JSON.parse(stored));
      } catch (error) {
        console.error('Error loading deals:', error);
      }
    }
  }, []);

  // Save deals to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('deals', JSON.stringify(deals));
  }, [deals]);

  const addDeal = (dealData: Omit<Deal, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newDeal: Deal = {
      ...dealData,
      id: `deal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setDeals(prev => [newDeal, ...prev]);

    // Send notification to admin if the current user is a salesman
    if (user?.role === 'salesman') {
      addNotification({
        type: 'new_deal',
        title: 'New Deal Created',
        message: `${user.name} created a new deal for ${dealData.customerName} worth $${dealData.amount.toLocaleString()}`,
        dealId: newDeal.id,
        fromUser: user.id,
        toUser: 'admin-1',
        priority: dealData.amount > 5000 ? 'high' : dealData.amount > 2000 ? 'medium' : 'low'
      });
    }
  };

  const updateDeal = (dealId: string, updates: Partial<Deal>) => {
    setDeals(prev =>
      prev.map(deal =>
        deal.id === dealId
          ? { ...deal, ...updates, updatedAt: new Date().toISOString() }
          : deal
      )
    );

    // Send notification for important updates
    if (updates.status && user) {
      addNotification({
        type: 'deal_update',
        title: 'Deal Updated',
        message: `Deal status changed to ${updates.status}`,
        dealId,
        fromUser: user.id,
        toUser: 'admin-1',
        priority: 'medium'
      });
    }
  };

  const deleteDeal = (dealId: string) => {
    setDeals(prev => prev.filter(deal => deal.id !== dealId));
  };

  const getDealsByAgent = (agentName: string) => {
    return deals.filter(deal => deal.salesAgent === agentName);
  };

  const getDealsStats = () => {
    const totalDeals = deals.length;
    const totalRevenue = deals.reduce((sum, deal) => sum + deal.amount, 0);
    const avgDealSize = totalDeals > 0 ? totalRevenue / totalDeals : 0;
    const closedDeals = deals.filter(deal => deal.status === 'closed').length;

    return {
      totalDeals,
      totalRevenue,
      avgDealSize,
      closedDeals
    };
  };

  const value = {
    deals,
    addDeal,
    updateDeal,
    deleteDeal,
    getDealsByAgent,
    getDealsStats
  };

  return (
    <DealsContext.Provider value={value}>
      {children}
    </DealsContext.Provider>
  );
};