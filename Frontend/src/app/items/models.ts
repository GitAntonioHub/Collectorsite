export interface ItemDTO {
  id: string;
  title: string;
  description: string;
  condition?: string;
  year?: number;
  estimatedValue?: number;
  status?: ItemStatus;
  images?: ItemImage[];
  documents?: ItemDocument[];
}

export enum ItemStatus {
  DRAFT = 'DRAFT',
  AVAILABLE = 'AVAILABLE',
  LISTED = 'LISTED',
  SOLD = 'SOLD',
  TRADED = 'TRADED'
}

export interface ItemImage {
  id: string;
  url: string;
  isPrimary: boolean;
}

export interface ItemDocument {
  id: string;
  filePath: string;
  type: string;
}

export interface Item {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  createdAt: Date;
} 