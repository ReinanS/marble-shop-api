import { prisma } from "../database/prisma-client";
import { UserRepository } from "../interfaces/user.repository.interface";
import { CreateUserInput, ProfileResponse, User, UserResponse } from "../types/user";

class UserRepositoryPrisma implements UserRepository {
  
  async create(data: CreateUserInput): Promise<UserResponse> {
  const result = await prisma.$transaction(async (prisma) => {
    const user = await prisma.users.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
        role: data.role,
      },
    });

    const employer = await prisma.employers.create({
      data: {
        cnpj: data.employer.cnpj,
        company_name: data.employer.company_name,
        fantasy_name: data.employer.fantasy_name,
        user_id: user.id, 
      },
      select: {
        id: true,
      }
    });

    const updatedUser = await prisma.users.update({
      where: { id: user.id },
      data: {
        employer_id: employer.id,
      },
    });

    return updatedUser;
  });

  return result;
}

  async findByEmail(email: string): Promise<User | null> {
    const result = await prisma.users.findUnique({
      where: {
        email
      }
    });

    return result || null;
  }

  async findById(id: string): Promise<ProfileResponse | null> {
    const result = await prisma.users.findUnique({
      where: {
        id
      }
    });

    return result || null;
  }
}

export { UserRepositoryPrisma }