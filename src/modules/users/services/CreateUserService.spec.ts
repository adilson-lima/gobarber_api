import 'reflect-metadata';
import AppError from '@shared/errors/AppError'

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository'
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider'

import CreateUserService from './CreateUserService'
import FakeCachePrivider from '@shared/container/providers/CacheProvider/fakes/FakeCachePrivider';

let fakeUsersRepository: FakeUsersRepository
let fakeHashProvider: FakeHashProvider
let createUser: CreateUserService
let fakeCachePrivider: FakeCachePrivider

//Categoria de testes
describe('CreateUser', () => {
    
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository()
        fakeHashProvider = new FakeHashProvider()
        fakeCachePrivider = new FakeCachePrivider()

        createUser = new CreateUserService(
            fakeUsersRepository, 
            fakeHashProvider,
            fakeCachePrivider
        )
    })

    it('should be able to create a new appointment', async() => {
        

        const user = await createUser.execute({
            name: 'John Doe',
            email: 'johndoe@example.com', 
            password: '123456'
        })

        expect(user).toHaveProperty('id')
    })

    it('should not be able to create a new user with same email from another', async() => {

        const user = await createUser.execute({
            name: 'John Doe',
            email: 'johndoe@example.com', 
            password: '123456'
        })

        await expect(
            createUser.execute({
                name: 'John Doe',
                email: 'johndoe@example.com', 
                password: '123456'
            })
        ).rejects.toBeInstanceOf(AppError)
    })
})