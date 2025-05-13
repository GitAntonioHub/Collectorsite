export interface ItemDTO {
  id: string;
  title: string;
  description: string;
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
