import { getMongoRepository, MongoRepository } from 'typeorm'
import { ObjectID } from 'mongodb'

import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository'
import ICreateNotificationDto from '@modules/notifications/dtos/ICreateNotificationDTO'

import Notification from '../../infra/typeorm/schemas/Notification'

export default class NotificationsRepository implements INotificationsRepository{

   private notifications: Notification[] = [];

    public async create({ content, recipient_id }: ICreateNotificationDto): Promise<Notification>{
        
        const notification = new Notification()
        
        Object.assign(notification, { 
            id: new ObjectID(), 
            content, 
            recipient_id 
        })

        this.notifications.push(notification)

        return notification
    }
}
