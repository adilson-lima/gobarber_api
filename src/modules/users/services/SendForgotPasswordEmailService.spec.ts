import 'reflect-metadata';
import AppError from '@shared/errors/AppError'

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository'
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider'
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository'

import SendForgotPasswordEmailService from './SendForgotPasswordEmailService'


let fakeUsersRepository: FakeUsersRepository
let fakeMailProvider: FakeMailProvider
let fakeUserTokensRepository: FakeUserTokensRepository
let sendForgotPasswordEmailService: SendForgotPasswordEmailService

//Categoria de testes
describe('SendForgotPasswordEmail', () => {

    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository()
        fakeMailProvider = new FakeMailProvider()
        fakeUserTokensRepository = new FakeUserTokensRepository()
        
        sendForgotPasswordEmailService = new SendForgotPasswordEmailService(
            fakeUsersRepository,
            fakeMailProvider,
            fakeUserTokensRepository
        )
    })
    
    it('should be able to recover the password using the email', async() => {
        

        const sendMail = jest.spyOn(fakeMailProvider, 'sendEmail')

        await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456'
        })


        await sendForgotPasswordEmailService.execute({
            email: 'johndoe@example.com',
        })

        expect(sendMail).toHaveBeenCalled()
    })


    it('should not be able to recover a non existing user password', async () => {
        
       await expect(
            sendForgotPasswordEmailService.execute({
                email: 'johndoe@example.com',
            })
        ).rejects.toBeInstanceOf(AppError)
    })
    
    it('shold generate a forgot password token', async () => {
        
        const generateToken = jest.spyOn(fakeUserTokensRepository, 'generate')

        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: '123456'
        })


        await sendForgotPasswordEmailService.execute({
            email: 'johndoe@example.com',
        })

        expect(generateToken).toHaveBeenCalledWith(user.id)
    })


})

// src/modules/users/services/SendForgotPasswordEmailService.spec.ts