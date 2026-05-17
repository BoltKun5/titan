import { ScrapeRunStatus, ScrapeRunTrigger } from '../../../../enums';

export type IFederationScrapeRun = {
  id: string;
  federationId: string;
  startedAt: string;
  finishedAt: string | null;
  status: ScrapeRunStatus;
  trigger: ScrapeRunTrigger;
  targetType: string;
  targetExternalId: string | null;
  rowsInserted: number;
  rowsUpdated: number;
  rowsSkipped: number;
  errors: Array<{ message: string; context?: Record<string, unknown> }>;
  initiatedByUserId: string | null;
  durationMs: number | null;
  createdAt?: string;
  updatedAt?: string;
};
