import { Directive, Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional } from 'class-validator';

@ObjectType()
@Directive('@key(fields: "id")')
export class User {
  @Field(() => ID)
  id: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  avatarUrl: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@InputType()
export class UpdateUserInput {
  @Field({ nullable: true })
  @IsOptional()
  firstName: string;

  @Field({ nullable: true })
  @IsOptional()
  surname: string;

  @Field({ nullable: true })
  @IsOptional()
  avatarUrl: string;
}

@InputType()
export class UpdatePasswordInput {
  @Field()
  @IsNotEmpty()
  oldPassword: string;

  @Field()
  @IsNotEmpty()
  newPassword: string;
}
