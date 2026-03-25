import { MessageType } from '../../../../enums';

export interface ISendMessageBody {
  content: string;
  type?: MessageType;
  replyToId?: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
}
