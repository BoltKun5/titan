import { PreSignedTypeEnum } from '../../../../enums';
import { ISigninAuthResponse } from './auth.response';

export interface IGetPreSignedResponse {
  type: PreSignedTypeEnum;
  data: ISigninAuthResponse | { mail: string };
}
