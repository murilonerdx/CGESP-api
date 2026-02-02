import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('daily_analytics')
export class DailyAnalytic {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    date: string; // YYYY-MM-DD

    @Column()
    region: string; // e.g., "CENTRO", "ZONA SUL"

    @Column({ default: 0 })
    totalPoints: number;

    @Column({ default: 0 })
    intransitablePoints: number;

    @CreateDateColumn()
    createdAt: Date;
}
