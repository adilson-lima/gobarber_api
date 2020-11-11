import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm'

import User from './User'

@Entity('appointments')
class Appointment {

    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column('uuid')
    provider_id: string

    @Column('timestamp with time zone')
    date: Date

    @CreateDateColumn()
    created_at: Date

    @UpdateDateColumn()
    updated_at: Date

    @ManyToOne(()=>User)
    @JoinColumn({ name: 'provider_id'})
    user: User

}


export default Appointment