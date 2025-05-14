/* src/app/shared/page.model.ts */
export interface Page<T>{
  content:T[];
  totalElements:number;
  number:number;
  size:number;
}
