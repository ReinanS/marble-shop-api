import { JWT } from "@fastify/jwt";
import { Roles } from "@prisma/client";
import bcrypt from 'bcrypt'
import { UserAlreadyExistsError, SALT_ROUNDS, InvalidEmailOrPassword, ACESS_TOKEN_EXPIRATION_TIME, REFRESH_TOKEN_EXPIRATION_TIME } from "../helpers";
import { UserRepository } from "../interfaces";
import { UserRepositoryPrisma } from "../repositories";
import { LoginInput, AcessAndRefreshToken } from "../types/login";
import { CreateUserInput, UserResponse } from "../types/user";
import { FastifyInstance } from "fastify";


class UserUseCase {
  private userRepository: UserRepository;
  private fastify: FastifyInstance;

  constructor(fastify: FastifyInstance) {
    this.userRepository = new UserRepositoryPrisma();
    this.fastify = fastify;
  }

  async create(user: CreateUserInput): Promise<UserResponse> {
    const verifyUserExists = await this.userRepository.findByEmail(user.email);

    if (verifyUserExists) {
      throw new UserAlreadyExistsError(user.email);
    }

    const hashedPassword = await bcrypt.hash(user.password, SALT_ROUNDS)

    return await this.userRepository.create({ ...user, role: Roles.ADMIN, password: hashedPassword });
  }

  async login(loginUser: LoginInput): Promise<AcessAndRefreshToken> {
    const userData = await this.userRepository.findByEmail(loginUser.email);
    const isMatch = userData && (await bcrypt.compare(loginUser.password, userData.password));

    if (!userData || !isMatch) {
      throw new InvalidEmailOrPassword();
    }

    const payload = {
      id: userData.id,
      email: userData.email,
      name: userData.name,
    }

    const accessToken = this.fastify.jwt.sign(payload, { expiresIn: ACESS_TOKEN_EXPIRATION_TIME });
    const refreshToken = this.fastify.jwt.sign(payload, { expiresIn: REFRESH_TOKEN_EXPIRATION_TIME });

    return {accessToken, refreshToken};
  }


  async refreshToken(refreshToken: string, jwt: JWT): Promise<string> {
    const decoded = jwt.verify(refreshToken);
    const newAcessToken = jwt.sign(decoded, { expiresIn: ACESS_TOKEN_EXPIRATION_TIME })
    return newAcessToken;
  }

  async getUser(id: string): Promise<UserResponse> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new Error('usuário nao encontrado');
    }

    return user;
  }
}

export { UserUseCase };