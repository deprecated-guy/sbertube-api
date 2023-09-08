import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('video')
export class VideoEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  title: string;
  @Column()
  shortBody: string;
  @ManyToOne(() => UserEntity, (user) => user.videos)
  author: string;
}
