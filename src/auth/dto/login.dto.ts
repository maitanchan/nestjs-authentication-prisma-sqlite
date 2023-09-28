import { IsEmail, IsNotEmpty } from "class-validator";

export class LoginhDto {

    @IsNotEmpty()
    @IsEmail()
    email: string

    @IsNotEmpty()
    password: string

}
