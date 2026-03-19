import { AdminConfigTypeEnum } from '../../../enums';

export type IAdminConfig = {
  id: string;
  name: string;
  label: string | null;
  type: AdminConfigTypeEnum;
  value: string;
};
