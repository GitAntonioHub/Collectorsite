export interface UploadProgress<T> {
  done: boolean;
  progress: number;
  body?: T;
}

export interface ApiError {
  status: number;
  message: string;
  timestamp: string;
  path: string;
} 