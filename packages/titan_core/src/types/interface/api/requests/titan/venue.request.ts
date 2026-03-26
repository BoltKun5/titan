export interface ICreateVenueBody {
  name: string;
  address?: string;
  capacity?: number;
}

export interface IUpdateVenueBody {
  name?: string;
  address?: string;
  capacity?: number;
}
