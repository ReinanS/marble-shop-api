export class InvalidOrMissingRefreshTokenError extends Error {
  constructor() {
    super('Invalid or missing refresh token')
    this.name = 'InvalidOrMissingRefreshTokenError'
  }
}