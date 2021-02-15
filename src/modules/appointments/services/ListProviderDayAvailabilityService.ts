
import { injectable, inject } from 'tsyringe'
import { getHours, isAfter } from 'date-fns'

import IAppointmentsRepository from '../repositories/IAppointmentsRepository'



interface IRequest {
    provider_id: string;
    day: number;
    month: number;
    year: number;
}

//Porque nao tem interface de array
type IResponse = Array<{
    hour: number;
    available: boolean;
}>

@injectable()
export default class ListProviderDayAvailabilityService {

    constructor(
        @inject('AppointmentsRepository')
        private appointmentsRepository: IAppointmentsRepository
    ) { }

    public async execute({ provider_id, year, month, day}: IRequest): Promise<IResponse>{

        const appointments = await this.appointmentsRepository.findAllInDayFromProvider({
            provider_id,
            year,
            month,
            day,
        })
        
        const hourStart = 8

        const eachHourArray = Array.from (
            { length: 10 },
            (_, index ) => index + hourStart,
        )

        const currentDate = new Date(Date.now())

        // console.log(`current_date: ${currentDate}`)

        const availability = eachHourArray.map ( hour => {
            const hasAppointmentInHour = appointments.find( appointment => {
                return getHours(appointment.date) === hour
            })
            const compareDate = new Date(year, month - 1, day, hour)

            // console.log(compareDate)

            return {
                hour,
                available: !hasAppointmentInHour && isAfter(compareDate, currentDate)
            }
        })



        return availability

        // return [{ hour: 8, available: false }]
    }
}