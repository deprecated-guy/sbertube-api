import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('video')
export class VideoEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ default: '' })
  title: string;
  @Column({ default: '' })
  body: string;
  @Column({ default: '' })
  shortBody: string;
  @Column({ default: '' })
  path: string;
  @ManyToOne(() => UserEntity, (user) => user.videos)
  author: UserEntity;
}
