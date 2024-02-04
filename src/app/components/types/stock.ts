export interface StockInterface {
  id: number;
  material: string;
  count: number;
}

export interface StockHistory {
  id: number;
  created_date: number;
  done_by: number;
  material: number;
  count: number;
  comment: string;
  is_adjunction: number;
}
