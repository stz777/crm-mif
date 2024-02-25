export interface TaskFromDbInterface {
  id: number;
  created_date: any;
  deadline: any;
  done_at: any;
  description: string;
  manager: number;
  managerName: string;
}

export interface SearchInterface {
  keyword?: string;
  is_archive?: "true";
}
