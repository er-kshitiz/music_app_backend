import { Prisma, PrismaClient } from '@prisma/client';

import { UserWithoutPassword } from '@/routes/user/userModel';

export class UserRepository {
  private prisma: PrismaClient;

  constructor(prisma?: PrismaClient) {
    if (prisma) {
      this.prisma = prisma;
    } else {
      this.prisma = new PrismaClient();
    }
  }

  async findAllAsync(): Promise<UserWithoutPassword[]> {
    const users: UserWithoutPassword[] = await this.prisma.user.findMany({
      select: {
        id: true,
        userType: true,
        firstName: true,
        lastName: true,
        email: true,
        contactNumber: true,
        age: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return users;
  }

  async createAsync(data: Prisma.UserCreateInput): Promise<UserWithoutPassword> {
    // Check if email already exists
    const existingUserByEmail = await this.prisma.user.findUnique({ where: { email: data.email } });
    if (existingUserByEmail) {
      throw new Error('Email is already in use.');
    }
    const newUser = await this.prisma.user.create({ data });

    return newUser;
  }

  async findByIdAsync(id: number): Promise<UserWithoutPassword | null> {
    const user: UserWithoutPassword | null = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        userType: true,
        firstName: true,
        lastName: true,
        email: true,
        contactNumber: true,
        age: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return user;
  }
}

export const userRepository = new UserRepository();
