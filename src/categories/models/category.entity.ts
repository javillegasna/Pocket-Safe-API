import { ObjectType, Field } from '@nestjs/graphql';
import { User } from 'src/users/models/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Category {
  @PrimaryGeneratedColumn('uuid')
  @Field()
  id: string;

  @Column()
  @Field()
  categoryName: string;

  @Column()
  @Field()
  userId: string;

  @Column()
  @Field()
  icon: string;

  @ManyToOne(() => User, (user) => user.categories, { onDelete: 'CASCADE' })
  @Field(() => User)
  user: User;

  @Field()
  @Column()
  @CreateDateColumn({ nullable: true })
  created_at?: Date; // Creation date

  @Field()
  @Column({ nullable: true })
  @UpdateDateColumn()
  updated_at?: Date; // Last updated date

  @Field({ nullable: true })
  @Column({ nullable: true })
  @DeleteDateColumn()
  deleted_at?: Date; // Deletion date
}
