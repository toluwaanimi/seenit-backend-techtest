import {
  InputType,
  Field,
  Int,
  ObjectType,
  PartialType,
  Directive,
  ID,
} from '@nestjs/graphql';

@InputType()
export class ProjectFilterInput {
  @Field(() => Int, { defaultValue: 1 })
  page: number;

  @Field(() => Int, { defaultValue: 50 })
  limit: number;
}

@InputType()
export class CreateProjectInput {
  @Field()
  name: string;

  @Field()
  description: string;

  @Field({ nullable: true })
  createdBy?: string;
}

@ObjectType()
@Directive('@extends')
@Directive('@key(fields: "id")')
export class User {
  @Field(() => ID)
  @Directive('@external')
  id: string;
}

@ObjectType()
@Directive('@key(fields: "id")')
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
  id: string;
}
