import { getRepository } from 'typeorm' 
import { compare } from 'bcryptjs'
import { sign } from 'jsonwebtoken'

import User from '../models/User'
import authConfig from '../config/auth'
import AppError from '../errors/AppError'



interface Request {
    email: string
    password: string
}


export default class AuthenticateUserService{

    public async execute({email, password}: Request): Promise<{user: User, token: string}>{

        const userRepository = getRepository(User)

        const user = await userRepository.findOne({
            where: { email }
        })

        if(!user){
            throw new AppError('User or password incorrect', 401)
        }

        const passwordMatched = await compare(password, user.password)

        if( !passwordMatched ){
            throw new AppError('User or password incorrect', 401)
        }

        const { secret, expiresIn} = authConfig.jwt

        const token = sign({}, secret, {
            subject: user.id,
            expiresIn
        })

        return ({ user, token })

    }
}