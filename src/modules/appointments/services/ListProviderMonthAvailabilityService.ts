
import { injectable, inject } from 'tsyringe'
import { getDaysInMonth, getDate, isAfter } from 'date-fns'

// import AppError from '@shared/errors/AppError'
import User from '@modules/users/infra/typeorm/entities/User'
import IUsersRepository from '@modules/users/repositories/IUsersRepository'
import IAppointmentsRepository from '../repositories/IAppointmentsRepository'



interface IRequest {
    provider_id: string;
    month: number;
    year: number;
}

//Porque nao tem interface de array
type IResponse = Array<{
    day: number;
    available: boolean;
}>

@injectable()
export default class ListProviderMonthAvailabilityService {

    constructor(
        @inject('AppointmentsRepository')
        private appointmentsRepository: IAppointmentsRepository
    ) { }

    public async execute({ provider_id, year, month}: IRequest): Promise<IResponse>{

        const appointments = await this.appointmentsRepository.findAllInMonthFromProvider({
            provider_id,
            year,
            month
        })
        
        const numberOfDaysInMonth = getDaysInMonth(
            new Date(year, month -1, )
        )
        
        const eachDayArray = Array.from(
            { length: numberOfDaysInMonth },
            (_ , index) => index + 1
        )

        const avalilability = eachDayArray.map( day => {
            const compareDate = new Date(year, month - 1, day, 23, 23, 59)
            const appointmentInDay = appointments.filter( appointment => {
                return getDate(appointment.date) === day
            })
            return {
                day,
                available: 
                    isAfter(compareDate, new Date(),  ) && appointmentInDay.length < 10
            }
        })

        return avalilability
    }
}