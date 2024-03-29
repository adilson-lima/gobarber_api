import ListProviderDayAvailabilityService from '@modules/appointments/services/ListProviderDayAvailabilityService'
import { Request, Response } from 'express'
import { container } from 'tsyringe'

// import ListProvidersService from '@modules/appointments/services/ListProvidersService'

export default class ProvidersDayAvailabilityController {

    public async index (request: Request, response: Response): Promise<Response> {
        
        const { provider_id } = request.params

        const { day, month, year } = request.query

        const user_id = request.user.id
    
        const listProviderDayAvailabilityService = container.resolve(ListProviderDayAvailabilityService)
    
        const availability = await listProviderDayAvailabilityService.execute({
            provider_id,
            day: Number(day),
            month: Number(month),
            year: Number(year)
        })
    
        return response.json(availability)
    }
}