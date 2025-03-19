import { Routes } from '@angular/router';
import { NotFoundComponent } from './not-found/not-found.component';
import { HealthComponent } from './health/health.component';
import { HomeComponent } from './home/home.component';
import { CartComponent } from './cart/cart.component';
import { FitnessComponent } from './fitness/fitness.component';
import { LifeComponent } from './life/life.component';
import { NutritionComponent } from './nutrition/nutrition.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SubscribeComponent } from './subscribe/subscribe.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'health', component: HealthComponent },
    { path: 'fitness', component: FitnessComponent },
    { path: 'life', component: LifeComponent },
    { path: 'nutrition', component: NutritionComponent },
    { path: 'sign-in', component: SignInComponent },
    { path: 'subscribe', component: SubscribeComponent },
    { path: 'cart', component: CartComponent },
    { path: '**', component: NotFoundComponent }
];
