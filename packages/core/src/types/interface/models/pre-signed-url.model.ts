import { PreSignedTypeEnum } from '../../../enums';

export type IPreSignedUrl = {
  id: string;
  type: PreSignedTypeEnum;
  expirationDate?: Date;
  mail: string;
};
