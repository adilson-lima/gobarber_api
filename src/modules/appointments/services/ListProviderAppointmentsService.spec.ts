import 'reflect-metadata';
import AppError from '@shared/errors/AppError'

import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderAppointmentsService from './ListProviderAppointmentsService';
import FakeCachePrivider from '@shared/container/providers/CacheProvider/fakes/FakeCachePrivider';

let fakeAppointmentsRepository: FakeAppointmentsRepository
let listProviderAppointmentsService: ListProviderAppointmentsService
let fakeCachePrivider: FakeCachePrivider

//Categoria de testes
describe('ListProviderAppointments', () => {
    
    beforeEach(() => {
        fakeAppointmentsRepository = new FakeAppointmentsRepository()
        fakeCachePrivider = new FakeCachePrivider()
        listProviderAppointmentsService = new ListProviderAppointmentsService(
            fakeAppointmentsRepository, 
            fakeCachePrivider
        )
        
    })

    it('should be able to list the appointments on a specific day', async() => {
        
        const appointment1 = await fakeAppointmentsRepository.create({
            provider_id: 'provider',
            user_id: 'user',
            date: new Date(2020, 4, 20, 14, 0, 0)
        })


        const appointment2 = await fakeAppointmentsRepository.create({
            provider_id: 'provider',
            user_id: 'user',
            date: new Date(2020, 4, 20, 15, 0, 0)
        })

        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 20, 11).getTime()
        })


        const appointments = await listProviderAppointmentsService.execute({
            provider_id: 'provider',
            year: 2020,
            month: 5,
            day: 20,
        })

        expect(appointments).toEqual([
            appointment1,
            appointment2,
        ])
        

    })



    
})