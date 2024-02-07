export class UserModel {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl: string;
  password?: string;
  createdAt: Date;
  updatedAt: Date;
}
