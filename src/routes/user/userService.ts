import { Prisma } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';

import { ResponseStatus, ServiceResponse } from '@/common/models/serviceResponse';
import { UserWithoutPassword } from '@/routes/user/userModel';
import { UserRepository } from '@/routes/user/userRepository';
import { logger } from '@/server';

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  // Common error handling method
  private handleError(
    ex: Error,
    errorMessagePrefix: string,
    statusCode: number
  ): ServiceResponse<any> {
    const errorMessage = `${errorMessagePrefix}: ${ex.message}`;
    logger.error(errorMessage);
    return new ServiceResponse(ResponseStatus.Failed, errorMessage, null, statusCode);
  }

  // Retrieves all users from the database
  async findAll(): Promise<ServiceResponse<UserWithoutPassword[] | null>> {
    try {
      const users = await this.userRepository.findAllAsync();
      if (!users) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          'No Users found',
          null,
          StatusCodes.NOT_FOUND
        );
      }
      return new ServiceResponse<UserWithoutPassword[]>(
        ResponseStatus.Success,
        'Users found',
        users,
        StatusCodes.OK
      );
    } catch (ex) {
      return this.handleError(
        ex as Error,
        'Error finding all users',
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  // Retrieves a single user by their ID
  async create(body: Prisma.UserCreateInput): Promise<ServiceResponse<any | null>> {
    try {
      const user = await this.userRepository.createAsync(body);
      return new ServiceResponse<UserWithoutPassword>(
        ResponseStatus.Success,
        'User created Successfully',
        user,
        StatusCodes.OK
      );
    } catch (ex) {
      return this.handleError(
        ex as Error,
        'Error creating user',
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }

  // Retrieves a single user by their ID
  async findById(id: number): Promise<ServiceResponse<UserWithoutPassword | null>> {
    try {
      const user = await this.userRepository.findByIdAsync(id);
      if (!user) {
        return new ServiceResponse(
          ResponseStatus.Failed,
          'User not found',
          null,
          StatusCodes.NOT_FOUND
        );
      }
      return new ServiceResponse<UserWithoutPassword>(
        ResponseStatus.Success,
        'User found',
        user,
        StatusCodes.OK
      );
    } catch (ex) {
      return this.handleError(
        ex as Error,
        `Error finding user with id ${id}`,
        StatusCodes.INTERNAL_SERVER_ERROR
      );
    }
  }
}

export const userService = new UserService();
