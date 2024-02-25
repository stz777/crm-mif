export interface TaskFromDBInterface {
  id: number;
  created_date: string;
  deadline: string;
  done_at: string | null;
  description: string;
  manager: number;
  managerName: string;
}

export interface SearchInterface {
  keyword?: string;
  is_archive?: "true";
}