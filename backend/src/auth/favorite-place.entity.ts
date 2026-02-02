import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../auth/user.entity';

@Entity('favorite_places')
export class FavoritePlace {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string; // e.g., "Minha Casa", "Trabalho"

    @Column()
    type: string; // "CASA", "TRABALHO", "EVENTO", "OUTRO"

    @Column()
    region: string; // e.g., "ZONA SUL", "CENTRO"

    @ManyToOne(() => User, (user) => user.favoritePlaces)
    user: User;

    @Column()
    userId: number;
}
