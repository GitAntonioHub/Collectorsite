export interface TradeOffer {
  id: string;
  offeredItemId: string;
  requestedItemId: string;
  status: TradeStatus;
  offerDate: string;
  lastUpdated: string;
  offerMessage?: string;
  // Include item details for display
  offeredItem: {
    title: string;
    description: string;
    estimatedValue: number;
    images: string[];
  };
  requestedItem: {
    title: string;
    description: string;
    estimatedValue: number;
    images: string[];
  };
}

export enum TradeStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED'
} 