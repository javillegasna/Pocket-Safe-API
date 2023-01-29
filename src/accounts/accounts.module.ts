import { forwardRef, Module } from '@nestjs/common';
import { AccountsService } from './service/accounts.service';
import { AccountsResolver } from './resolver/accounts.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './models/account.entity';
import { UsersModule } from 'src/users/users.module';
import { TransactionsModule } from 'src/transactions/transactions.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Account]),
    forwardRef(() => UsersModule),
    forwardRef(() => TransactionsModule),
  ],
  providers: [AccountsResolver, AccountsService],
  exports: [AccountsService],
})
export class AccountsModule {}
