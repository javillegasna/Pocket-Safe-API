import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToMany,
} from 'typeorm';

import { ObjectType, Field, Float } from '@nestjs/graphql';

import { AccountType } from '../common/accounts.enums';

import { User } from 'src/users/models/user.entity';
import { Transaction } from 'src/transactions/models/transaction.entity';
import { ColumnNumericTransformer } from 'src/.common/transformers/numeric.transformer';
@Entity()
@ObjectType()
export class Account {
  @PrimaryGeneratedColumn('uuid')
  @Field()
  id: string;

  @Column()
  @Field()
  name: string;

  @Column()
  @Field()
  icon: string;

  @Column({
    type: 'varchar',
    enum: AccountType,
    default: AccountType.SAVINGS,
  })
  @Field()
  type: AccountType;

  @Field(() => Float)
  @Column('numeric', {
    precision: 2,
    scale: 2,
    transformer: new ColumnNumericTransformer(),
  })
  totalAmount: number;

  @Column()
  @Field()
  userId: string;

  @ManyToOne(() => User, (user) => user.accounts, { onDelete: 'CASCADE' })
  @Field(() => User)
  user: User;

  @Field(() => [Transaction], { nullable: true })
  @ManyToMany(() => Transaction, (transaction) => transaction.accounts, {
    onDelete: 'CASCADE',
  })
  transactions: Transaction[];

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
