import { IsNotEmpty, IsEmail, MinLength, MaxLength } from 'class-validator'

export class RegisterDto {

    @IsNotEmpty()
    name: string

    @IsNotEmpty()
    @IsEmail()
    email: string

    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(16)
    password: string

}