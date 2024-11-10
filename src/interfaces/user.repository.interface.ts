import { CreateUserInput, ProfileResponse, User, UserResponse } from "../types/user";

export interface UserRepository {
  create(data: CreateUserInput): Promise<UserResponse>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<ProfileResponse | null>;
  resetPassword(id: string, newPassword: string): Promise<void>;
}