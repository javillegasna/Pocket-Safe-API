import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { Account } from 'src/accounts/models/account.entity';
import { Category } from 'src/categories/models/category.entity';

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field()
  id: string;

  @Column()
  @Field()
  name: string;

  @Column()
  @Field()
  lastName: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  nickName?: string;

  @OneToMany(() => Account, (account) => account.user, { onDelete: 'CASCADE' })
  @Field(() => [Account], { nullable: true })
  accounts: Account[];

  @OneToMany(() => Category, (category) => category.user, {
    onDelete: 'CASCADE',
  })
  @Field(() => [Category], { nullable: true })
  categories: Category[];

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
