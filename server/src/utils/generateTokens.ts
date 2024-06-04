import { IUser } from '../models/userModel';
import jwt from 'jsonwebtoken'
import { redis } from "../models/redis"

export const generateTokens = (user: IUser)=> {
const accessToken = user.generateAccesToken();
  const refreshToken = user.generateRefreashToken();
  //upload session to redis
  redis.set(user._id,JSON.stringify(user));
  return { accessToken, refreshToken };
};