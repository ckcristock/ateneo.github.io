export interface Request<T> {
  status: boolean;
  code: number;
  data: T;
  err: string | null;
}

export interface RequestPaginate<T> {
  current_page: number;
  data: T;
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  next_page_url: null;
  path: string;
  per_page: number;
  prev_page_url: null;
  to: number;
  total: number;
}
