// import { NextFunction, Request, Response } from "express";
// import User, { IUser } from "../models/userModel";
// import { generateTokens } from "../utils/jwtUtils";
// import { setCookie } from "../utils/cookieUtils";

// import catchAsyncError from "../middlewares/catchAsyncError";
// import ErrorHandler from "../middlewares/ErrorHandler";

// export const signup = catchAsyncError(
//   async (req: Request, res: Response): Promise<void> => {
//     const { username, email, password } = req.body;

//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       res.status(400).json({ error: "Email already exists" });
//     }

//     // Create new user
//     const newUser: IUser = new User({
//       username,
//       email,
//       password,
//     });
//     await newUser.save();

//     //tokens
//     const { accessToken, refreshToken } = generateTokens(newUser);

//     // Set tokens in cookies
//     setCookie(res, "accessToken", accessToken, { httpOnly: true });
//     setCookie(res, "refreshToken", refreshToken, { httpOnly: true });
//     res.status(201).json({
//       message: "User registered successfully",
//       user: newUser,
//       accessToken,
//     });
//   }
// );

// export const login = catchAsyncError(
//   async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       next(new ErrorHandler("please enter username and email", 400));
//       return;
//     }

//     const user: IUser | null = await User.findOne({ email });

//     if (!user) {
//       res.status(401).json({ error: "Invalid email or password" });
//       return;
//     }

//     // Compare passwords
//     const passwordMatch = await user.comparePassword(password);

//     if (!passwordMatch) {
//       res.status(401).json({ error: "Invalid email or password" });
//       return;
//     }

//     const { accessToken, refreshToken } = generateTokens(user);

//     // Set tokens in cookies
//     setCookie(res, "accessToken", accessToken, { httpOnly: true });
//     setCookie(res, "refreshToken", refreshToken, { httpOnly: true });
//     res.status(200).json({ message: "Login successful", user, accessToken });
//   }
// );

// export const logout = (req: Request, res: Response): void => {
//   try {
//     // Clear token cookies
//     res.clearCookie("accessToken");
//     res.clearCookie("refreshToken");

//     // Send response
//     res.status(200).json({ message: "Logout successful" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };
