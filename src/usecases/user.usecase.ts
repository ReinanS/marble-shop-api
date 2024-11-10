import { JWT } from "@fastify/jwt";
import { Roles } from "@prisma/client";
import bcrypt from 'bcrypt'
import { UserAlreadyExistsError, SALT_ROUNDS, InvalidEmailOrPassword, ACESS_TOKEN_EXPIRATION_TIME, REFRESH_TOKEN_EXPIRATION_TIME, SENDER_EMAIL, encryptData, MARBLE_FRONT_ENDPOINT, InvalidOrMissingRefreshTokenError, ResetPasswordError } from "../helpers";
import { UserRepository } from "../interfaces";
import { UserRepositoryPrisma } from "../repositories";
import { LoginInput, AcessAndRefreshToken } from "../types/login";
import { CreateUserInput, UserResponse } from "../types/user";
import { FastifyInstance } from "fastify";
import { UserNotFoundError } from "../helpers/errors/user-not-found.error";
import { sendMail } from "../adapters/mail.adapter";
import ejs from "ejs";
import dayjs from "dayjs";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";


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

    if (!newAcessToken) {
      throw new InvalidOrMissingRefreshTokenError()
    }

    return newAcessToken;
  }

  async getUser(id: string): Promise<UserResponse> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new UserNotFoundError(id);
    }

    return user;
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new UserNotFoundError(email);
    }

    const mailTemplate = await ejs.renderFile('resources/emails/password-recovery.html', {
      name: user.name,
      data: encryptData(JSON.stringify({
        userId: user.id,
        name: user.name,
        expiresOn: dayjs().add(30, "minutes").toDate(),
      })),
      marbleFrontEndpoint: MARBLE_FRONT_ENDPOINT,
    })

    await sendMail({
      from: SENDER_EMAIL,
      to: user.email,
      subject: `⚙️ Recuperação de conta no Marble Shop!`,
      html: mailTemplate,
      attachments: [
          {
            filename: "logo.png",
            path: "resources/images/logo.png",
            cid: "logo",
          },
        ],
    })
  }

  async resetPassword(userId: string, newPassword: string): Promise<void> {
    try {

      const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS)
      await this.userRepository.resetPassword(userId, hashedPassword);
      
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === "P2025") {
        throw new UserNotFoundError(userId);
      }

      throw new ResetPasswordError(userId);
    }
  }
}

export { UserUseCase };