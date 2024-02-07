import { Directive, Field, ID, InputType, ObjectType } from '@nestjs/graphql';

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
  firstName: string;

  @Field({ nullable: true })
  surname: string;

  @Field({ nullable: true })
  avatarUrl: string;
}

@InputType()
export class UpdatePasswordInput {
  @Field()
  oldPassword: string;

  @Field()
  newPassword: string;
}
