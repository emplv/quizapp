export interface ICredentials {
  email: string;
  password: string;
}

export interface IUser {
  _id?: string;
  email: string;
  name: string;
  permissionFlags: number;
}
