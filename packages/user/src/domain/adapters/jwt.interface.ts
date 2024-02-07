/**
 * @name IJwtServicePayload
 * @description This is the interface for the JwtServicePayload
 * @property id - This is the id of the user
 */
export interface IJwtServicePayload {
  id: string;
}

/**
 * @name IJwtService
 * @description This is the interface for the JwtService
 * @method verifyJwtToken - This method verifies the jwt token
 * @method generateJwtToken - This method generates the jwt token
 *
 */
export interface IJwtService {
  verifyJwtToken(token: string): Promise<any>;

  generateJwtToken(payload: IJwtServicePayload): string;
}
