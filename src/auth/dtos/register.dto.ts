import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional } from "class-validator";
import Address from "src/users/address.entity";

export class RegisterDto {

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(7)
  password: string;

  @IsOptional()
  address: Address;
}

export default RegisterDto;