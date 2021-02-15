import { getRepository, Repository, Raw} from 'typeorm'

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointments'

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository'
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO'
import IFindAllInMonthFromProviderDto from '@modules/appointments/dtos/IFindAllInMonthFromProviderDTO'
import IFindAllInDayFromProviderDto from '@modules/appointments/dtos/IFindAllInDayFromProviderDTO'





class AppointmentsRepository implements IAppointmentsRepository{

    private ormRepository: Repository<Appointment>

    constructor() {
        this.ormRepository = getRepository(Appointment)
    }
    
    public async findByDate (date: Date, provider_id: string): Promise<Appointment | undefined>{
        const findAppointment = await this.ormRepository.findOne({
            where: {date, provider_id}
        })
        
        return findAppointment
    }

    public async findAllInMonthFromProvider({ provider_id, month, year }: IFindAllInMonthFromProviderDto): Promise<Appointment[]> {

        const parseMonth = String(month).padStart(2, '0')

        // Raw do typeorm passa a tratativa diretamente para o banco de dados sem intermedicacoes ou conversoes
        // Ideal para executar algo nativo
        const appointmests = await this.ormRepository.find({
            where: {
                provider_id,
                date: Raw(dateFieldName => 
                    `to_char(${dateFieldName}, 'MM-YYYY') = '${parseMonth}-${year}'`
                )
            }
        })
        return appointmests
    }


    public async findAllInDayFromProvider({ provider_id, day, month, year }: IFindAllInDayFromProviderDto): Promise<Appointment[]> {

        const parseMonth = String(month).padStart(2, '0')
        const parseDay = String(day).padStart(2, '0')

        // Raw do typeorm passa a tratativa diretamente para o banco de dados sem intermedicacoes ou conversoes
        // Ideal para executar algo nativo
        const appointmests = await this.ormRepository.find({
            where: {
                provider_id,
                date: Raw(dateFieldName => 
                    `to_char(${dateFieldName}, 'DD-MM-YYYY') = '${parseDay}-${parseMonth}-${year}'`
                )
            },
            relations: ['user']
        })
        return appointmests
    }
    

    public async create({provider_id, user_id,  date}:ICreateAppointmentDTO): Promise<Appointment>{
        const appointment = this.ormRepository.create({provider_id, user_id,  date})
        await this.ormRepository.save(appointment)

        return appointment
    }
}

export default AppointmentsRepository