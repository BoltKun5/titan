import { IVenue } from '../../../models';

export interface IVenueResponse {
  venue: IVenue;
}

export interface IVenueListResponse {
  venues: IVenue[];
}
