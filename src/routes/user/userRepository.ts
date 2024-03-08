import { PrismaClient, Prisma, User as PrismaUser } from '@/generated/client';
import { User, UserWithoutPassword } from '@/routes/user/userModel';

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
        username: true,
        email: true,
        age: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return users as unknown as User[];
  }

  async createAsync(data: Prisma.UserCreateInput): Promise<UserWithoutPassword> {
    // Check if username already exists
    const existingUserByUsername = await this.prisma.user.findUnique({
      where: { username: data.username },
    });
    if (existingUserByUsername) {
      throw new Error('Username is already taken.');
    }
    // Check if email already exists
    const existingUserByEmail = await this.prisma.user.findUnique({ where: { email: data.email } });
    if (existingUserByEmail) {
      throw new Error('Email is already in use.');
    }
    const newUser = await this.prisma.user.create({ data });

    return newUser as UserWithoutPassword;
  }

  async findByIdAsync(id: number): Promise<UserWithoutPassword | null> {
    const user: UserWithoutPassword | null = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        age: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return user as unknown as User;
  }
}

export const userRepository = new UserRepository();
