import  {v4 as uuid}  from 'uuid'
import { isEqual, getMonth, getYear, getDate} from 'date-fns'

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointments'

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository'
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO'
import IFindAllInMonthFromProviderDto from '@modules/appointments/dtos/IFindAllInMonthFromProviderDTO'
import IFindAllInDayFromProviderDto from '@modules/appointments/dtos/IFindAllInDayFromProviderDTO'





class AppointmentsRepository implements IAppointmentsRepository{

    private appointments: Appointment[] = []
    
    public async findByDate (date: Date, provider_id: string): Promise<Appointment | undefined>{

        const findAppointment = this.appointments.find(
            appointment => 
                isEqual(appointment.date, date) &&
                appointment.provider_id === provider_id
        )

        return findAppointment
    }

    public async findAllInMonthFromProvider({ provider_id, month, year }: IFindAllInMonthFromProviderDto): Promise<Appointment[]> {

        const appointmests = this.appointments.filter(appointment => 
            appointment.provider_id === provider_id &&
            getMonth(appointment.date) + 1 === month &&
            getYear(appointment.date) === year
        )

        return appointmests
    }


    public async findAllInDayFromProvider({ provider_id, day,  month, year  }: IFindAllInDayFromProviderDto): Promise<Appointment[]> {

        const appointmests = this.appointments.filter(appointment => 
            appointment.provider_id === provider_id &&
            getDate(appointment.date) === day &&
            getMonth(appointment.date) + 1 === month &&
            getYear(appointment.date) === year
        )

        return appointmests
    }



    public async create({provider_id, user_id, date}:ICreateAppointmentDTO): Promise<Appointment>{
        

        const appointment = new Appointment()

        // appointment.id = uuid.v4()
        // appointment.date = date
        // appointment.provider_id = provider_id

        // Semelhante a atribuicao de valores acima
        Object.assign(appointment, { id: uuid(), date, provider_id, user_id })

        this.appointments.push(appointment)

        return appointment
    }
}

export default AppointmentsRepository