export class InvalidEmailOrPassword extends Error {
  constructor() {
    super('Invalid email or password');
    this.name = 'InvalidEmailOrPassword';
  }
}
