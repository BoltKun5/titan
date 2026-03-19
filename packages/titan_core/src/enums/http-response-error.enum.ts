export enum HttpErrorCode {
  notFound = 'NOT_FOUND',
  internalServerError = 'INTERNAL_SERVER_ERROR',
  unknown = 'UNKNOWN_ERROR',
  unauthorized = 'UNAUTHORIZED',
  signupvalidation = 'BAD_SIGNUP_VALUES',
  signinvalidation = 'BAD_SIGNIN_VALUES',
  invaliduser = 'USER_NOT_FOUND',
  badpassword = 'INCORRECT_PASSWORD',
  badusername = 'UNKNOWN_USER',
  badvalues = 'BAD_VALUES',
  inactiveAccount = 'INACTIVE_ACCOUNT',
  expired = 'EXPIRED_TOKEN',
}

export enum ErrorType {
  apiError = 'api_error',
  authError = 'authentication_error',
  resourceError = 'resource_error',
}
