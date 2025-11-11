import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { Register } from './auth/register/register';
import { Dashboard } from './dashboard/dashboard';
import { CreateGoal } from './goals/create-goal/create-goal';
import { GoalsList } from './goals/goals-list/goals-list';
import { GoalDetails } from './goals/goal-details/goal-details';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'dashboard', component: Dashboard },
  { path: 'goals/create', component: CreateGoal },
  { path: 'goals', component: GoalsList },
  { path: 'goals/:id', component: GoalDetails }
];