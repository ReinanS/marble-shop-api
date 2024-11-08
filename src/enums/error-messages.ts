export enum ErrorMessages {
  // Geral
  INTERNAL_SERVER_ERROR = "internal_server_error",
  ERROR_ENCRYPTING_DATA = "error_encrypting_data",
  ERROR_DECRYPTING_DATA = "error_decrypting_data",
  INVALID_REQUEST_BODY = "invalid_request_body",
  TIME_EXPIRED = "time_expired",

  // Auth
  USER_NOT_FOUND = "user_not_found",
  INVALID_CREDENTIALS = "invalid_credentials",
  UNAUTHORIZED_USER = "unauthorized_user",
  JWT_SECRET_KEY_NOT_CONFIGURED = "jwt_secret_key_not_configured",
}
