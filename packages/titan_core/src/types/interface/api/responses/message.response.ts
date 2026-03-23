import { IMessage } from '../../models';

export interface IMessageListResponse {
  messages: IMessage[];
  maxPages: number;
  currentPage: number;
  totalItems: number;
}

export interface IMessageResponse {
  message: IMessage;
}
