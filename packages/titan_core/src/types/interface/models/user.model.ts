export type IUser = {
  id: string;
  role: number;
  firstName: string;
  lastName: string;
  shownName: string;
  mail: string;
  options: Record<string, string> | null;
  password: string;
  isActive: boolean;
};
