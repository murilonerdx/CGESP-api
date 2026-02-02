import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

export class AuthCredentialsDto {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    password: string;

    @IsOptional()
    @IsString()
    region?: string;
}
