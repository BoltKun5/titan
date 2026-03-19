export type IUser = {
  id: string;
  role: number;
  shownName: string;
  mail: string;
  options: Record<string, string> | null;
  password: string;
  isActive: boolean;
};
