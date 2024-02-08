import { InputType, Field, ObjectType, ID } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

@InputType()
export class RegisterUserInput {
  @Field()
  @IsNotEmpty()
  firstName: string;

  @Field()
  @IsNotEmpty()
  surname: string;

  @Field()
  @IsEmail({}, { message: 'Invalid email address' })
  email: string;

  @Field()
  @IsNotEmpty()
  password: string;

  @Field({ nullable: true })
  @IsOptional()
  avatarUrl: string;
}

@InputType()
export class LoginUserInput {
  @Field()
  @IsEmail({}, { message: 'Invalid email address' })
  email: string;

  @Field()
  @IsNotEmpty()
  password: string;
}

@ObjectType()
export class Token {
  @Field(() => String)
  token: string;
}
