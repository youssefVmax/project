export interface Deal {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  country: string;
  amount: number;
  commission: number;
  duration: number;
  product: string;
  serviceType: string;
  salesAgent: string;
  closingAgent: string;
  team: string;
  status: 'pending' | 'closed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  notes?: string;
  priority: 'low' | 'medium' | 'high';
}

export interface Notification {
  id: string;
  type: 'new_deal' | 'deal_update' | 'system' | 'alert';
  title: string;
  message: string;
  dealId?: string;
  fromUser: string;
  toUser: string;
  isRead: boolean;
  createdAt: string;
  priority: 'low' | 'medium' | 'high';
}