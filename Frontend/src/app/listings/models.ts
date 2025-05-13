export interface ListingDTO {
  id: string;
  itemId: string;
  title: string;
  price: number;
  currency: string;
  listingType: 'SALE' | 'AUCTION';
}
