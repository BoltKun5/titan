export type SessionToken = {
  expiration: string;
  iat?: number;
  exp?: number;
} & SessionTokenPayload;

export type SessionTokenPayload = {
  UUID?: string;
};
