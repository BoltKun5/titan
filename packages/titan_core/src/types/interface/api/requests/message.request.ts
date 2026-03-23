import { MessageType } from '../../../../enums';

export interface ISendMessageBody {
  content: string;
  type?: MessageType;
}
