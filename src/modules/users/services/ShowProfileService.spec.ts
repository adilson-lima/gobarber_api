import 'reflect-metadata';
import AppError from '@shared/errors/AppError'

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository'


import ShowProfileService from './ShowProfileService'

let fakeUsersRepository: FakeUsersRepository
let showProfileService: ShowProfileService

//Categoria de testes
describe('ShowProfileService', () => {
    
    beforeEach(() => {
         fakeUsersRepository = new FakeUsersRepository()
         showProfileService = new ShowProfileService(fakeUsersRepository)

    })

    it('should be able show the profile', async() => {
        
        const user = await fakeUsersRepository.create({
            name: 'John Doe',
            email: 'johndoe@example.com', 
            password: '123456'
        })

        const profile = await showProfileService.execute({
            user_id: user.id
        })

        expect(profile.name).toBe('John Doe')
        expect(profile.email).toBe('johndoe@example.com')
    })

    it('should not be able show the profile from non existing user', async() => {
        
        await expect(
            showProfileService.execute({
            user_id: 'non-existing-id'
        })).rejects.toBeInstanceOf(AppError)
    })


    
})