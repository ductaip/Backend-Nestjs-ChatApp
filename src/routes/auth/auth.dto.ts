import { createZodDto } from 'nestjs-zod';
import {
  LoginBodySchema,
  LoginResSchema,
  LogoutBodySchema,
  RefreshTokenBodySchema,
  RefreshTokenResSchema,
  RegisterBodySchema,
  RegisterResSchema,
} from './auth.model';

export class RegisterBodyDTO extends createZodDto(RegisterBodySchema) {}

export class RegisterResDTO extends createZodDto(RegisterResSchema) {}

export class LoginBodyDTO extends createZodDto(LoginBodySchema) {}

export class LoginResDTO extends createZodDto(LoginResSchema) {}

export class RefreshTokenBodyDTO extends createZodDto(RefreshTokenBodySchema) {}

export class RefreshTokenResDTO extends createZodDto(RefreshTokenResSchema) {}

export class LogoutBodyDTO extends createZodDto(LogoutBodySchema) {}
