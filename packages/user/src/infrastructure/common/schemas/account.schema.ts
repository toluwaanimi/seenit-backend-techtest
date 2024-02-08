import { Directive, Field, ID, InputType, ObjectType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional } from 'class-validator';

/**
 * @name Directive
 * @description Directive
 */
function getKeyDirective<T>(): any {
  return Directive('@key(fields: "id")');
}
/**
 * User object type
 * @class User
 * @description User object type
 */
@ObjectType()
@getKeyDirective()
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
/**
 * @name UpdateUserInput
 * @description Update user input
 */
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

/**
 * @name UpdatePasswordInput
 * @description Update password input
 */
@InputType()
export class UpdatePasswordInput {
  @Field()
  @IsNotEmpty()
  oldPassword: string;

  @Field()
  @IsNotEmpty()
  newPassword: string;
}
