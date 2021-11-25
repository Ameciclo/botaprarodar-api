import { Expose } from "class-transformer";
import { transformAndValidate } from "class-transformer-validator";
import { IsDefined, IsEmail } from "class-validator";

export default class UpdatePasswordRequest {
  @IsDefined()
  @Expose()
  @IsEmail()
  email: string;

  @IsDefined()
  @Expose()
  password: string;

  public static convertBodyToRequest =
    (body: {}): Promise<UpdatePasswordRequest> =>
      transformAndValidate(UpdatePasswordRequest, body);
}
