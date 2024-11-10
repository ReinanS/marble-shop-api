export class UserNotFoundError extends Error {
  constructor(userIdentifier: string) {
    super(`User with ${userIdentifier} é inválido ou inexistente`);
    this.name = 'UserNotFoundError';
  }
}