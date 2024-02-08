
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export class LoginUserInput {
    email: string;
    password: string;
}

export class RegisterUserInput {
    firstName: string;
    surname: string;
    email: string;
    password: string;
    avatarUrl?: Nullable<string>;
}

export class UpdateUserInput {
    firstName?: Nullable<string>;
    surname?: Nullable<string>;
    avatarUrl?: Nullable<string>;
}

export class Token {
    token: string;
}

export class User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatarUrl?: Nullable<string>;
    createdAt: DateTime;
    updatedAt: DateTime;
}

export abstract class IQuery {
    abstract pong(): string | Promise<string>;

    abstract profile(): User | Promise<User>;

    abstract users(): User[] | Promise<User[]>;

    abstract user(id: string): User | Promise<User>;
}

export abstract class IMutation {
    abstract login(input: LoginUserInput): Token | Promise<Token>;

    abstract register(input: RegisterUserInput): Token | Promise<Token>;

    abstract profile(data: UpdateUserInput): User | Promise<User>;
}

export type DateTime = any;
type Nullable<T> = T | null;
