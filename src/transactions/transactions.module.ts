import { forwardRef, Module } from '@nestjs/common';
import { TransactionsService } from './service/transactions.service';
import { TransactionsResolver } from './resolver/transactions.resolver';
import { Transaction } from './models/transaction.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesModule } from 'src/categories/categories.module';
import { Account } from 'src/accounts/models/account.entity';
import { AccountsModule } from 'src/accounts/accounts.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction, Account]),
    forwardRef(() => CategoriesModule),
    forwardRef(() => AccountsModule),
  ],
  providers: [TransactionsResolver, TransactionsService],
})
export class TransactionsModule {}
