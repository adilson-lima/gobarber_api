import { response, Router } from 'express'
import { startOfHour, parseISO } from 'date-fns'
import { getCustomRepository } from 'typeorm'

import AppointmentsRepository from '../repositories/AppointmentsRepository'
import CreateAppointmentService from '../services/CreateAppointmentService'
import ensureAuthenticated from '../middlewares/ensureAuthenticated'

const appointmentsRouter = Router()

appointmentsRouter.use(ensureAuthenticated)


appointmentsRouter.get('/', async (request, response) => {

    const repository = getCustomRepository(AppointmentsRepository)

    const appointments = await repository.findOne()

    // console.log(request.user.id)

    return response.json(appointments)
})

appointmentsRouter.post('/', async (request, response) => {

    const { date, provider_id } = request.body
    const parseDate = parseISO(date)

    const createAppointment = new CreateAppointmentService()

    const appointment = await createAppointment.execute({
        date: parseDate,
        provider_id
    })

    return response.json(appointment)
})


export default appointmentsRouter