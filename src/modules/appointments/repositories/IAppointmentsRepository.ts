import Appointment from '../infra/typeorm/entities/Appointments'

import ICreateAppointmentDTO from '../dtos/ICreateAppointmentDTO'
import IFindAllInMonthFromProviderDto from '../dtos/IFindAllInMonthFromProviderDTO'
import IFindAllInDayFromProviderDto from '../dtos/IFindAllInDayFromProviderDTO'
 
export default interface IAppointmentsRepository {
    create(data: ICreateAppointmentDTO): Promise<Appointment>
    findByDate(date: Date, provider_id: string): Promise<Appointment | undefined>
    findAllInMonthFromProvider(data: IFindAllInMonthFromProviderDto): Promise<Appointment[]>
    findAllInDayFromProvider(data: IFindAllInDayFromProviderDto): Promise<Appointment[]>
}