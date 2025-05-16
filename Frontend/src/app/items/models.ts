export interface ItemDTO {
  id: string;
  title: string;
  description: string;
  condition?: string;
  year?: number;
  estimatedValue?: number;
  status?: string;
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