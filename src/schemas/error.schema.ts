import { z } from "zod";

export const InternalServerErrorSchema = z.object({
  error: z.string().default('Internal Server Error').describe('Generic error message for internal failures'),
}).describe('Unexpected server error');

export const NoAuthorizationErrorSchema = z.object({
  error: z.string().default('No authorization header').describe('Error for missing authorization header'),
}).describe('Error when the authorization header is not provided');

export const UserAlreadyExistsErrorSchema = z.object({
  error: z.string().default('User already exists').describe('Error for attempt to create an already existing user'),
}).describe('Error when trying to register a user that already exists');

export const InvalidInputDataErrorSchema = z.object({
  error: z.string().default('Invalid input data').describe('Error for invalid input data in the request'),
}).describe('Error validating the input data');

export const InvalidOrMissingTokenErrorSchema = z.object({
  error: z.string().default('Invalid or missing refresh token').describe('Error when the refresh token is invalid or missing'),
}).describe('Authentication error due to invalid or missing token');

export const UserNotFoundErrorSchema = z.object({
  error: z.string().default('Invalid or non-existent user').describe('Error when the id is incorrect'),
}).describe('Error when querying user');

export const EmailSendErrorSchema = z.object({
  error: z.string().default('Failed to send the email').describe('Error that occurred when trying to send the email'),
}).describe('Error when trying to send an email');

export const ResetPasswordErrorSchema = z.object({
  error: z.string().default('Failed to update the password').describe('Error that occurred when trying to update the user\'s password'),
}).describe('Error when trying to update the user\'s password');
