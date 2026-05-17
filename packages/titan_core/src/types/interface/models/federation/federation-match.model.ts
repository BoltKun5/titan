import { FederationMatchStatus, ForfeitSide } from '../../../../enums';

export type IFederationMatch = {
  id: string;
  externalId: string;
  federationId: string;
  matchdayId: string | null;
  poolId: string | null;
  homeTeamId: string;
  awayTeamId: string;
  dateUtc: string;
  status: FederationMatchStatus;
  scoreHome: number | null;
  scoreAway: number | null;
  venueId: string | null;
  forfeitSide: ForfeitSide | null;
  lastScrapedAt: string | null;
  lastScrapeRunId: string | null;
  sourceUrl: string | null;
  isManual: boolean;
  createdAt?: string;
  updatedAt?: string;
};
