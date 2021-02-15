import { Request, Response } from 'express'
import { parseISO } from 'date-fns'
import { container } from 'tsyringe'

import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService'
import { classToClass } from 'class-transformer'

export default class AppointmentController {

    public async create (request: Request, response: Response): Promise<Response> {
        
        const user_id = request.user.id
        const { date, provider_id } = request.body
        // const parseDate = parseISO(date)
    
        const createAppointment = container.resolve(CreateAppointmentService)
    
        const appointment = await createAppointment.execute({
            date,
            provider_id,
            user_id
        })
    
        return response.json(classToClass(appointment))
    }
}