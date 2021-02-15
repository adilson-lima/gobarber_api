
import { injectable, inject } from 'tsyringe'

import AppError from '@shared/errors/AppError'

import User from '@modules/users/infra/typeorm/entities/User'

import IUsersRepository from '../repositories/IUsersRepository'
import IHashProvider from '../providers/HashProvider/models/IHashProvider'
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider'


interface IRequest {
    name: string
    email: string
    password: string
}

@injectable()
export default class CreateUserService {

    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,

        @inject('HashProvider')
        private hashProvider: IHashProvider,

        @inject('CacheProvider')
        private cacheProvider: ICacheProvider
        
    ) { }

    public async execute({ name, email, password }: IRequest): Promise<User> {

        const findUser = await this.usersRepository.findByEmail(email)

        if (findUser) {
            throw new AppError('This user already exists')
        }

        const hashPassword = await this.hashProvider.generateHash(password)

        const user = await this.usersRepository.create({ 
            name, 
            email,
            password: hashPassword
        })

        await this.cacheProvider.invalidatePrefix('providers-list')

        return (user)
    }
}