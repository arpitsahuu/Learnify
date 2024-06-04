import jwt from 'jsonwebtoken';
import { IUser } from '../models/userModel';
interface IRegistrationBody {
    name: string;
    email: string;
    password: string;
    avatar?: string;
    contact?: number;
  }
export const activationToken = (user:IRegistrationBody,ActivationCode:number) =>{
    const tokenKey:string = process.env.REFRESH_TOKEN_SECRET || "";
    const token = jwt.sign({
        user,
        ActivationCode
    },
    tokenKey,
    {
        expiresIn:"5m"
    });

    return token;
}