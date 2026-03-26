import { IMatch } from '../../../models';

export interface IDashboardManagerResponse {
  totalMembers: number;
  activeLicenses: number;
  subscriptionRate: number;
  upcomingMatches: IMatch[];
  recentResults: IMatch[];
  alerts: IDashboardAlert[];
}

export interface IDashboardCoachResponse {
  teamPlayerCount: number;
  upcomingMatches: IMatch[];
  recentResults: IMatch[];
  trainingAttendanceRate: number;
}

export interface IDashboardPlayerResponse {
  upcomingMatches: IMatch[];
  upcomingTrainings: { date: string; startTime: string; endTime: string }[];
  personalStats: {
    goals: number;
    assists: number;
    minutesPlayed: number;
    matchesPlayed: number;
  };
}

export interface IDashboardAlert {
  type: 'missing_certificate' | 'expired_license' | 'unpaid_fee' | 'repeated_absence';
  message: string;
  memberId: string;
}
