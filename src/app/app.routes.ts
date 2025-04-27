import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { AccountSuccessComponent } from './pages/account-success/account-success.component';
import { LoanResultComponent } from './pages/loan-result/loan-result.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { TransactionHistoryComponent } from './pages/transaction-history/transaction-history.component';
import { VerifyActivationCodeComponent } from './pages/verify-activation-code/verify-activation-code.component';
import { ViewAccountComponent } from './pages/view-account/view-account.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { BankTransferComponent } from './pages/bank-transfer/bank-transfer.component';
import { DepositWithdrawComponent } from './pages/deposit-withdraw/deposit-withdraw.component';
import { LoanformComponent } from './pages/loanform/loanform.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'success', component: AccountSuccessComponent },
    { path: 'transaction-history', component: TransactionHistoryComponent },
    { path: 'verifyAccount', component: VerifyActivationCodeComponent },
    { path: 'bank-transfer', component: BankTransferComponent },
    { path: 'depo-withdraw', component: DepositWithdrawComponent },
    { path: 'view-account', component: ViewAccountComponent },
    { path: 'dashboard',component: DashboardComponent},
    { path: 'loan-result', component: LoanResultComponent },
    { path: 'reset-password', component: ResetPasswordComponent },
    { path: 'loan-apply', component: LoanformComponent },
    { path: 'loan-status', component: LoanResultComponent },

];
