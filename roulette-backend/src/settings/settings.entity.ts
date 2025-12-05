import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Settings {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 40 })
  dudCount: number;

  @Column('simple-json', { default: '["노래","대사","방제","게임권"]' })
  prizes: string[];

  @Column({ default: 5000 })
  donationAmount: number;
}
