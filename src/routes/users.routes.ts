import { Router } from 'express'
import multer from 'multer'

import uploadConfig from '../config/upload'
import updateAvatarService from '../services/UpdateUserAvatarService'

import CreateUserService from '../services/CreateUserService'
import ensureAuthenticated from '../middlewares/ensureAuthenticated'


const usersRouter = Router()
const upload = multer(uploadConfig)


usersRouter.post('/', async (request, response) => {

    try {
        const { name, email, password } = request.body

        const createUserService = new CreateUserService()
        const user = await createUserService.execute({ name, email, password })

        //@ts-ignore
        delete user.password

        return response.json(user)
    }
    catch (err) {
        return response.status(400).json({ error: err.message })
    }
})

usersRouter.patch('/avatar',
    ensureAuthenticated,
    upload.single('avatar'),
    async (request, response) => {

        const updateUserAvatar = new updateAvatarService()

        const user = await updateUserAvatar.execute({
            user_id: request.user.id,
            avatarFilename: request.file.filename
        })

        //@ts-ignore
        delete user.password

        return response.json(user)
    })

export default usersRouter