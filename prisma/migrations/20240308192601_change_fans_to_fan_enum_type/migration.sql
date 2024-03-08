/*
  Warnings:

  - The values [fans] on the enum `users_user_type` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `users` MODIFY `user_type` ENUM('artist', 'fan', 'superadmin') NOT NULL;
