import { compare, hash } from "bcryptjs";
import { classToPlain } from "class-transformer";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { getConnection } from "typeorm";
import { User } from "../entity/User";
import { AuthRequest } from "../middlewares/AuthRequestContext";
import { InternalServerError } from "../response/InternalServerErrorResponse";
import { LoginResponse } from "../response/LoginResponse";
import { RequestFailed } from "../response/RequestFailedResponse";


export const createUser = async (req: Request, res: Response) => {
  try {        
    const fullName: string = req.body.fullName || "";
    const username: string = req.body.userName;
    const password: string = req.body.password;
    const phoneNumber: string = req.body.phoneNumber;
    const timestamp = req.body.timestamp
      ? new Date(req.body.timestamp)
      : new Date();

    if (!username || !username.trim().length) {
      return RequestFailed(res, 400, "username");
    }
    if (!password || !password.trim().length) {
      return RequestFailed(res, 400, "password");
    }
    if (!fullName || !fullName.trim().length) {
      return RequestFailed(res, 400, "fullName");
    }
    if (!phoneNumber || !phoneNumber.trim().length) {
      return RequestFailed(res, 400, "phonenumber");
    }

    const hashPassword = await hash(password, 12);

      const user = new User();
      user.userName = username;
      user.password = hashPassword;
      user.fullName = fullName;
      user.phoneNumber = phoneNumber;
      user.timestamp = timestamp;
      await user.save();

      const userResponse = classToPlain(user);


      const data = {
        id: user.id,
        username: user.userName,

      };
      const token = await jwt.sign(data, process.env.TOKEN_SECRET!, {
        expiresIn: process.env.JWT_EXPIRE_TIME,
      });

      const refreshToken = await jwt.sign(
        data,
        process.env.REFRESH_TOKEN_SECRET!,
        {
          expiresIn: process.env.JWT_EXPIRE_TIME,
        }
      );
      if (token) {
        res.status(200).json({
          success: true,
          token:token,
          refreshToken:refreshToken,
          user: userResponse,
        });
      }
    
  } catch (error) {
    return InternalServerError(res, error);
  }
};

export const Login = async (req: Request, res: Response) => {
  try {
    const username: string = req.body.username;
    const password: string = req.body.password;

    if (!username || !username.trim().length) {
      return RequestFailed(res, 400, "username");
    }

    if (!password || !password.trim().length) {
      return RequestFailed(res, 400, "password");
    }

    // const user = await User.findOne({
    //   where: { userName: username },
    //   relations: ["role", "userAssignedRoute"],
    // });

    const user = await getConnection()
      .getRepository(User)
      .createQueryBuilder("user")
      .where("user.userName = :username", { username })
      .getOne();

    if (!user) {
      return RequestFailed(res, 401, "bad username/password");
    } else {
      const isValidPass = await compare(password, user.password);
      if (!isValidPass) {
        return RequestFailed(res, 401, "bad username/password");
      }
      if (!user.isActive) {
        return RequestFailed(res, 401, "User is inactive");
      }
  
      const data = {
        id: user.id,
        username: user.userName,

      };
      const token = await jwt.sign(data, process.env.TOKEN_SECRET!, {
        expiresIn: "7d",
      });

      const refreshToken = await jwt.sign(
        data,
        process.env.REFRESH_TOKEN_SECRET!,
        {
          expiresIn: "30d",
        }
      );
      if (token) {
        res.status(202).json(LoginResponse(token, refreshToken, user));

      }
    }
  } catch (error) {
    return InternalServerError(res, error);
  }
};

export const getProfileDetails = async (req: AuthRequest, res: Response) => {
  try {    
    const user = await User.findOne(req.userId);

    if (!user) {
      return RequestFailed(res, 404, "user", req.userId);
    }

    const plainUser = classToPlain(user);
    res.status(200).json({
      success: true,
      user: plainUser,
    });
  } catch (error) {
    return InternalServerError(res, error);
  }
};

export const logout = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id
    
    const user = await User.findOne(id, { relations: ["role"] });

    if (!user) {
      return RequestFailed(res, 404, "user", req.userId);
    }

    const plainUser = classToPlain(user);
    res.status(200).json({
      success: true,
      user: plainUser,
    });
  } catch (error) {
    return InternalServerError(res, error);
  }
};