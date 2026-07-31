import jwt from "jsonwebtoken"
import config from "../config"

export const verifytoken = (token: string) => {
    return jwt.verify(
        token,
        config.jwt_access_secret as string
    )
}