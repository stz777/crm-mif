export interface TaskFromDBInterface {
  id: number;
  created_date: string;
  deadline: string;
  done_at: string | null;
  description: string;
  manager: number;
}
