export interface ListingDTO {
  id: string;
  itemId: string;
  listingType: 'SALE' | 'AUCTION';
  price: number;
  currency: string;
  startDate: string;
  endDate: string;
  status: 'ACTIVE' | 'SOLD' | 'TRADED' | 'CLOSED';
  // Item details
  title: string;
  description: string;
  imageUrl?: string;
  images?: { url: string }[];
  condition?: string;
  year?: number;
  estimatedValue?: number;
  owner: {
    id: string;
    displayName: string;
  };
  createdAt: string;
  updatedAt: string;
}
