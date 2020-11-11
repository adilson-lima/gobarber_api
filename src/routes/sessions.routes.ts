import { Router } from 'express'


import AuthenticateUserService from '../services/AuthenticateUserService'



const sessionsRouter = Router()


sessionsRouter.post('/', async (request, response) => {

    const { email, password } = request.body

    const { user, token } = await new AuthenticateUserService().execute({ email, password })

    //@ts-ignore
    delete user.password



    return response.json({ user, token })

})


export default sessionsRouter