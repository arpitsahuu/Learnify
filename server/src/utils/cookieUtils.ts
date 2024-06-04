// cookieUtils.ts
import { Response } from 'express';

export const setCookie = (res: Response, name: string, value: string, options?: any): void => {
  res.cookie(name, value, options);
};
