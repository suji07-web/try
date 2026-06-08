import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './auth.guard';
import { BranchDetailsComponent } from './branch-details/branch-details.component';
import {SettingsComponent} from './settings/settings.component';
import { EmiCalculatorComponent } from './emi-calculator/emi-calculator.component';
import { LoanDetailsComponent } from './loan-details/loan-details.component';


const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'home', component: HomeComponent, canActivate: [AuthGuard]},
  {path: 'logout',component: LoginComponent},
  {path: 'emi-calculator',component: EmiCalculatorComponent},
  {path: 'loan-details', component: LoanDetailsComponent},
  {path: 'settings', component: SettingsComponent, canActivate: [AuthGuard]},
  {path: 'branch-details', component: BranchDetailsComponent,canActivate: [AuthGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
