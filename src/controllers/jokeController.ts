import { Response } from "express";
import { AuthRequest } from "../middlewares/AuthRequestContext";
import { InternalServerError } from "../response/InternalServerErrorResponse";
import axios from 'axios';
import { joke } from "../types/jokeType";

export const getRandomJoke = async (_: AuthRequest, res: Response) => {
  try {

    const jokeData: joke = await axios(process.env.API_URL + 'jokes/random')

    if (jokeData) {
      res.status(200).json({
        success: true,
        jokeData: jokeData.data
      }
      );
    }






  } catch (error) {
    return InternalServerError(res, error);
  }
};
