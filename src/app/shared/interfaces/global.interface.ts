export interface Select {
  text: string;
  value: any;
}

export interface Pagination {
  page: number;
  pageSize: number;
  length: number;
}

export type typeHeaderButton = 'info' | 'warning' | 'danger' | 'success' | 'primary';
