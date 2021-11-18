import { Expose } from 'class-transformer';
import { transformAndValidate } from 'class-transformer-validator';
import { IsDefined, IsEmail, IsEnum, Matches } from 'class-validator';
import { ESystemUserType } from '../../models/ESystemUserType';

export class CreateSystemUserRequest {
  @IsDefined()
  @Expose()
  @IsEmail()
  emailNewUser: string;
  @IsDefined()
  @Expose()
  passwordNewUser: string;
  @IsDefined()
  @Expose()
  @IsEnum(ESystemUserType)
  typeNewUser: ESystemUserType;
  @IsDefined()
  @Expose()
  @IsEmail()
  emailCurrentUser: string;

  public static convertBodyToRequest =
    (body: {}): Promise<CreateSystemUserRequest> => {
      return transformAndValidate(CreateSystemUserRequest, body);
    };
}
