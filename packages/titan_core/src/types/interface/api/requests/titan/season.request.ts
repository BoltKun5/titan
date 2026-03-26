export interface ICreateSeasonBody {
  label: string;
  startDate: string;
  endDate: string;
  isCurrent?: boolean;
}

export interface IUpdateSeasonBody {
  label?: string;
  startDate?: string;
  endDate?: string;
  isCurrent?: boolean;
}
