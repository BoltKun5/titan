import { IMatch } from '../../../models';

// Shared sub-types
export interface IDashboardUpcomingMatch {
  id: string;
  date: string;
  opponent: string;
  teamName: string;
  location: string;
  venueLabel?: string;
}

export interface IDashboardRecentResult {
  id: string;
  date: string;
  opponent: string;
  teamName: string;
  scoreHome: number | null;
  scoreAway: number | null;
  location: string;
}

export interface IDashboardAlert {
  type: 'missing_certificate' | 'expired_license' | 'unpaid_fee' | 'repeated_absence';
  message: string;
  memberId: string;
  memberName: string;
}

// Dirigeant dashboard
export interface IDashboardManagerResponse {
  totalMembers: number;
  activeLicenses: number;
  expiredLicenses: number;
  cotisationsPaid: number;
  cotisationsUnpaid: number;
  subscriptionRate: number;
  upcomingMatches: IDashboardUpcomingMatch[];
  recentResults: IDashboardRecentResult[];
  alerts: IDashboardAlert[];
  clubStatsOverview: any;
}

// Entraîneur dashboard
export interface IDashboardCoachResponse {
  teams: { id: string; name: string; playerCount: number }[];
  upcomingMatches: IDashboardUpcomingMatch[];
  upcomingTrainings: {
    id: string;
    date: string;
    startTime: string;
    endTime: string;
    teamName: string;
  }[];
  recentResults: IDashboardRecentResult[];
  trainingAttendanceRate: number;
  topScorer: { playerName: string; goals: number } | null;
}

// Joueur dashboard
export interface IDashboardPlayerResponse {
  upcomingMatches: IDashboardUpcomingMatch[];
  upcomingTrainings: {
    id: string;
    date: string;
    startTime: string;
    endTime: string;
    teamName: string;
  }[];
  personalStats: {
    goals: number;
    assists: number;
    saves: number;
    minutesPlayed: number;
    matchesPlayed: number;
  };
  pendingDocuments: { type: 'medical' | 'license' | 'payment'; message: string }[];
}

export interface IDashboardResponse {
  role: string;
  data: IDashboardManagerResponse | IDashboardCoachResponse | IDashboardPlayerResponse;
}
