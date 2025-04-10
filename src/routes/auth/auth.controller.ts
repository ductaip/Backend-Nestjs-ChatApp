import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ZodSerializerDto } from 'nestjs-zod';
import {
  LoginBodyDTO,
  LoginResDTO,
  LogoutBodyDTO,
  RefreshTokenBodyDTO,
  RefreshTokenResDTO,
  RegisterBodyDTO,
  RegisterResDTO,
} from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ZodSerializerDto(RegisterResDTO)
  async register(@Body() body: RegisterBodyDTO) {
    return await this.authService.register(body);
  }

  @Post('login')
  @ZodSerializerDto(LoginResDTO)
  async login(@Body() body: LoginBodyDTO) {
    return await this.authService.login(body);
  }

  @Post('refresh-token')
  @ZodSerializerDto(RefreshTokenResDTO)
  async refreshToken(@Body() body: RefreshTokenBodyDTO) {
    return await this.authService.refreshToken(body);
  }

  @Post('logout')
  async logout(@Body() body: LogoutBodyDTO) {
    return await this.authService.logout(body);
  }
}
