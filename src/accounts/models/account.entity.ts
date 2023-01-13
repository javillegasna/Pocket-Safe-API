import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { ObjectType, Field } from '@nestjs/graphql';
import { AccountType } from '../common/accounts.enums';
import { User } from 'src/users/models/user.entity';

@Entity()
@ObjectType()
export class Account {
  @PrimaryGeneratedColumn('uuid')
  @Field()
  id: string;

  @Column()
  @Field()
  name: string;

  @Column({
    type: 'varchar',
    enum: AccountType,
    default: AccountType.SAVINGS,
  })
  @Field()
  type: AccountType;

  @Column()
  @Field()
  icon: string;

  @Column()
  @Field()
  userId: string;

  @ManyToOne(() => User, (user) => user.accounts, { onDelete: 'CASCADE' })
  @Field(() => User)
  user: User;

  @Field()
  @Column({ nullable: true })
  @CreateDateColumn()
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
