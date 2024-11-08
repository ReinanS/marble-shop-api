export class UserAlreadyExistsError extends Error {
  constructor(email: string) {
    super(`User with ${email} already exists`);
    this.name = 'UserAlreadyExistsError';
  }
}

