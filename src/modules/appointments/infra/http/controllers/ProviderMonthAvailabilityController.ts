import ListProviderMonthAvailabilityService from '@modules/appointments/services/ListProviderMonthAvailabilityService'
import { Request, Response } from 'express'
import { container } from 'tsyringe'

// import ListProvidersService from '@modules/appointments/services/ListProvidersService'

export default class ProvidersMonthAvailabilityController {

    public async index (request: Request, response: Response): Promise<Response> {
        
        const { provider_id } = request.params

        const { month, year } = request.query

        const user_id = request.user.id
    
        const listProviderMonthAvailabilityService = container.resolve(ListProviderMonthAvailabilityService)
    
        const availability = await listProviderMonthAvailabilityService.execute({
            provider_id,
            month: Number(month),
            year: Number(year)
        })
    
        return response.json(availability)
    }
}