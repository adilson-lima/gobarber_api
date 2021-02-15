import { container } from 'tsyringe'

import mailConfig from '@config/mail'
import IMailProvider from '../MailProvider/models/IMailProvider'

import EtherealMailProvider from './implementations/EtherealMailProvider'
import SESlMailProvider from './implementations/SESMailProvider'



const providers =  {
    ethereal: container.resolve(EtherealMailProvider),
    ses: container.resolve(SESlMailProvider)
}

// Para que o construtor seja chamado
container.registerInstance<IMailProvider>(
    'MailProvider',
    // new EtherealMailProvider()
   providers[mailConfig.driver]
)