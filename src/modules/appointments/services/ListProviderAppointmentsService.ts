
import { injectable, inject } from 'tsyringe'
import { getDaysInMonth, getDate } from 'date-fns'
import { classToClass } from 'class-transformer'

import IAppointmentsRepository from '../repositories/IAppointmentsRepository'
import Appointment from '../infra/typeorm/entities/Appointments'
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider'




interface IRequest {
    provider_id: string;
    day: number;
    month: number;
    year: number;
}

//Porque nao tem interface de array
type IResponse = Array<{
    day: number;
    available: boolean;
}>

@injectable()
export default class ListProviderAppointmentsService {

    constructor(
        @inject('AppointmentsRepository')
        private appointmentsRepository: IAppointmentsRepository,

        @inject( 'CacheProvider')
        private cacheProvider: ICacheProvider
    ) { }

    public async execute({ provider_id, year, month, day}: IRequest): Promise<Appointment[]>{

        const cacheKey = `provider-appointments:${provider_id}:${year}-${month}-${day}`

        let appointments = await this.cacheProvider.recover<Appointment[]>(cacheKey)

        // let appointments;

        if(!appointments) {
            appointments = await this.appointmentsRepository.findAllInDayFromProvider({
                provider_id,
                year,
                month, 
                day
            })

            // console.log('Buscou no banco')

            await this.cacheProvider.save(cacheKey, classToClass(appointments))
        }
        
        return appointments
    }
}