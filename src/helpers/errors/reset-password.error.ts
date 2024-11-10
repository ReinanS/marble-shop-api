// errors/ResetPasswordError.ts
export class ResetPasswordError extends Error {
    constructor(userId: string) {
        super(`Failed to reset password for user with ID: ${userId}`);
        this.name = "ResetPasswordError";
    }
}
