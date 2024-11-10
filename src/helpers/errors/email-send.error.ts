export class EmailSendError extends Error {
  constructor(email: string, originalError?: string) {
    super(`Failed to send email to ${email}. ${originalError ? "Error: " + originalError : ""}`);
    this.name = 'EmailSendError';
  }
}
