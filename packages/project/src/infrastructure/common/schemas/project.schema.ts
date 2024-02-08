import {
  InputType,
  Field,
  Int,
  ObjectType,
  PartialType,
  Directive,
  ID,
} from '@nestjs/graphql';
import { IsNotEmpty, IsOptional } from 'class-validator';

@InputType()
export class ProjectFilterInput {
  @Field(() => Int, { defaultValue: 1 })
  @IsOptional({})
  page: number;

  @Field(() => Int, { defaultValue: 50 })
  @IsOptional({})
  limit: number;
}

@InputType()
export class CreateProjectInput {
  @Field()
  @IsNotEmpty()
  name: string;

  @Field()
  @IsNotEmpty()
  description: string;

  @Field({ nullable: true })
  @IsOptional()
  createdBy?: string;
}

function getKeyDirective<T>(): any {
  return Directive('@key(fields: "id")');
}

function getExtendsDirective(): any {
  return Directive('@extends');
}

function getExternalDirective(): any {
  return Directive('@external');
}

@ObjectType()
@getExtendsDirective()
@getKeyDirective()
export class User {
  @Field(() => ID)
  @getExternalDirective()
  id: string;
}

@ObjectType()
@getKeyDirective()
export class Project {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field()
  createdBy: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field((type) => User, { nullable: true })
  user?: User;
}

@ObjectType()
export class PaginateProject {
  @Field(() => [Project])
  data: Project[];

  @Field(() => Int)
  limit: number;

  @Field(() => Int)
  itemCount: number;

  @Field(() => Int)
  itemsPerPage: number;

  @Field(() => Int)
  currentPage?: number;
}

@InputType()
export class UpdateProjectInput extends PartialType(CreateProjectInput) {
  @Field()
  @IsNotEmpty()
  id: string;
}
