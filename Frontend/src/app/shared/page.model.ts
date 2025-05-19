/* src/app/shared/page.model.ts */
export interface Page<T>{
  content:T[];
  totalElements:number;
  totalPages:number;
  number:number;
  size:number;
  last: boolean;
  first: boolean;
  empty: boolean;
}
