import {
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';

export const EmailNotFoundException = new UnprocessableEntityException([
  {
    message: 'Email is not exist',
    path: 'email',
  },
]);

export const EmailIsExistException = new UnprocessableEntityException([
  {
    message: 'Email is exist',
    path: 'email',
  },
]);

export const PasswordIsIncorrectException = new UnprocessableEntityException([
  {
    message: 'Password is incorrect',
    path: 'password',
  },
]);

export const RefreshTokenIsIncorrectException = new UnauthorizedException(
  'Refresh token is incorrect',
);

export const RefreshTokenIsUsedException = new UnauthorizedException(
  'Refresh token has been used',
);
