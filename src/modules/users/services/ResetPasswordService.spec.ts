import 'reflect-metadata';
import AppError from '@shared/errors/AppError'

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository'
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository'
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider'

import ResetPasswordService from './ResetPasswordService'


let fakeUsersRepository: FakeUsersRepository
let fakeUserTokensRepository: FakeUserTokensRepository
let fakeHashProvider: FakeHashProvider
let resetPasswordService: ResetPasswordService


//Categoria de testes
describe('ResetPassword', () => {

    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository()
        fakeUserTokensRepository = new FakeUserTokensRepository()
        fakeHashProvider = new FakeHashProvider()
        
        resetPasswordService = new ResetPasswordService(
            fakeUsersRepository,
            fakeUserTokensRepository,
            fakeHashProvider
        )
    })
    
    it('should be able to reset the password', async() => {
        
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456'
        })

        const { token } = await fakeUserTokensRepository.generate(user.id)

        const generateHash = jest.spyOn(fakeHashProvider, 'generateHash')

        await resetPasswordService.execute({
            password: '123123',
            token: token
        })

        const updatedUser = await fakeUsersRepository.findById(user.id)

        expect(generateHash).toHaveBeenLastCalledWith('123123')
        expect(updatedUser?.password).toBe('123123')

    })


    it('should not be able to reset password with non-existing token', async() => {

        await expect(
            resetPasswordService.execute({
                token: 'non-existing-token',
                password: '123456'
            })
        ).rejects.toBeInstanceOf(AppError)
    })

    it('should not be able to reset password with non-existing user', async() => {

        const user = {
            id: 'non-existing-user-id',
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456'
        }

        const { token } = await fakeUserTokensRepository.generate(user.id)

        await expect(
            resetPasswordService.execute({
                token,
                password: '123456'
            })
        ).rejects.toBeInstanceOf(AppError)
    })


    it('should not be able to reset the password more than 2 hours', async() => {
        
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456'
        })

        const { token } = await fakeUserTokensRepository.generate(user.id)

        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            const customDate = new Date();
            return customDate.setHours(customDate.getHours() + 3)
        })

        await expect(
            resetPasswordService.execute({
                password: '123123',
                token: token
            })
        ).rejects.toBeInstanceOf(AppError) 



    })



    // Hash
    //2h de expiracao
    // userToken inexistente
    // user inexistente



})

// src/modules/users/services/SendForgotPasswordEmailService.spec.ts