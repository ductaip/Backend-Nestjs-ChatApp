export interface AccessTokenPayloadCreate {
  userId: number;
  email: string;
}

export interface AccessTokenPayload extends AccessTokenPayloadCreate {
  exp: number;
  iat: number;
}

export interface RefreshTokenPayloadCreate {
  userId: number;
}

export interface RefreshTokenPayload extends RefreshTokenPayloadCreate {
  exp: number;
  iat: number;
}
