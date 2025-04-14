import { Types } from "mongoose";

declare global {
  namespace Express {
    interface Request {
      userId: Types.ObjectId;
      user?: IUser;
      cookies: {
        token: string;
      }
    }
    interface Headers {
      authorization?: string;
    }
  }
}

export interface UserRequestBody {
  name: string;
  email: string;
  password: string;
}

export interface ChangePassword {
  token:string;
  newPassword:string
}
export interface ResquestPassword {
  email:string;
}

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  usedResetTokens:{
    token: String,
  }[]
}

export interface ITask extends Document {
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'done';
  user: Types.ObjectId | IUser;
  createdAt?: Date;
  updatedAt?: Date;
}

