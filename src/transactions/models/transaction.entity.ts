import { ObjectType, Field, Float } from '@nestjs/graphql';
import { Account } from 'src/accounts/models/account.entity';
import { Category } from 'src/categories/models/category.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TransactionType } from '../common/transactions.enums';
class ColumnNumericTransformer {
  to(data: number): number {
    return data;
  }
  from(data: string): number {
    return parseFloat(data);
  }
}

@Entity()
@ObjectType()
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  @Field()
  id: string;

  @Field(() => [Account], { nullable: true })
  @ManyToMany(() => Account, (account) => account.transactions)
  @JoinTable({
    name: 'accounts_transactions',
    joinColumn: {
      name: 'transactionId',
    },
    inverseJoinColumn: {
      name: 'accountId',
    },
  })
  accounts: Account[];

  @ManyToOne(() => Category, (category) => category.transactions)
  @Field(() => Category)
  category: Category;

  @Field(() => Float)
  @Column('numeric', {
    precision: 2,
    scale: 2,
    transformer: new ColumnNumericTransformer(),
  })
  amount: number;

  @Field()
  @Column({
    type: 'varchar',
    enum: TransactionType,
    default: TransactionType.INPUT,
  })
  transactionType: TransactionType;

  @Column()
  @Field()
  categoryId: string;

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
  deleted_at?: Date; // Deletion dat
}
