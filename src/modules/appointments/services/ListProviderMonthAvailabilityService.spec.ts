import 'reflect-metadata';
import AppError from '@shared/errors/AppError'

import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import ListProviderMonthAvailabilityService from './ListProviderMonthAvailabilityService'


let fakeAppointmentsRepository: FakeAppointmentsRepository
let listProviderMonthAvailabilityService: ListProviderMonthAvailabilityService

//Categoria de testes
describe('ListProviderMonthAvailability', () => {
    
    beforeEach(() => {
        fakeAppointmentsRepository = new FakeAppointmentsRepository()
        listProviderMonthAvailabilityService = new ListProviderMonthAvailabilityService(fakeAppointmentsRepository)

    })

    it('should be able to list month availability from provider', async() => {
        
        await fakeAppointmentsRepository.create({
            provider_id: 'provider_id',
            user_id: 'user_id',
            date: new Date(2020, 3, 20, 8, 0, 0)
        })


        // Preenche agendamento de um dia
        for(let hour = 8 ; hour < 18 ; hour ++){
            await fakeAppointmentsRepository.create({
                provider_id: 'provider_id',
                user_id: 'user_id',
                date: new Date(2020, 4, 20, hour, 0, 0)
            })
        }
        

        await fakeAppointmentsRepository.create({
            provider_id: 'provider_id',
            user_id: 'user_id',
            date: new Date(2020, 4, 20, 10, 0, 0)
        })

        await fakeAppointmentsRepository.create({
            provider_id: 'provider_id',
            user_id: 'user_id',
            date: new Date(2020, 4, 21, 8, 0, 0)
        })

        const availability = await listProviderMonthAvailabilityService.execute({
            provider_id: 'provider_id',
            year: 2020,
            month: 5
        })

        expect(availability).toEqual(
            expect.arrayContaining([
                { day: 19, available: true },
                { day: 20, available: false },
                { day: 21, available: true },
                { day: 22, available: true },
            ])
        )

    })



    
})