import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { FavoritePlace } from './favorite-place.entity';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    email: string;

    @Column({ nullable: true })
    password?: string;

    @Column({ nullable: true })
    region?: string;

    @Column({ nullable: true })
    googleId?: string;

    @Column({ nullable: true })
    avatarUrl?: string;

    @OneToMany(() => FavoritePlace, (place) => place.user)
    favoritePlaces: FavoritePlace[];
}
