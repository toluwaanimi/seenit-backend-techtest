import { InputType, Field, ObjectType, ID } from '@nestjs/graphql';
import { IsEmail } from 'class-validator';

@InputType()
export class RegisterUserInput {
  @Field()
  firstName: string;

  @Field()
  surname: string;

  @Field()
  @IsEmail({}, { message: 'Invalid email address' })
  email: string;

  @Field()
  password: string;

  @Field({ nullable: true })
  avatarUrl: string;
}

@InputType()
export class LoginUserInput {
  @Field()
  @IsEmail({}, { message: 'Invalid email address' })
  email: string;

  @Field()
  password: string;
}

@ObjectType()
export class Token {
  @Field(() => String)
  token: string;
}
