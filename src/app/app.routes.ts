import { Routes } from '@angular/router';
import { NotFoundComponent } from './not-found/not-found.component';
import { HealthComponent } from './health/health.component';
import { HomeComponent } from './home/home.component';
import { CartComponent } from './cart/cart.component';
import { FitnessComponent } from './fitness/fitness.component';
import { NutritionComponent } from './nutrition/nutrition.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SubscribeComponent } from './subscribe/subscribe.component';
import { SignUpComponent } from './sign-up/sign-up.component';

//Health Sections Details
import { BrainHealth1Component } from './health/brain-health-1/brain-health-1.component';
import { BrainHealth2Component } from './health/brain-health-2/brain-health-2.component';
import { BrainHealth3Component } from './health/brain-health-3/brain-health-3.component';
import { BrainHealth4Component } from './health/brain-health-4/brain-health-4.component';
import { BrainHealth5Component } from './health/brain-health-5/brain-health-5.component';
import { BrainHealth6Component } from './health/brain-health-6/brain-health-6.component';
import { HeartHealth1Component } from './health/heart-health-1/heart-health-1.component';
import { HeartHealth2Component } from './health/heart-health-2/heart-health-2.component';
import { HeartHealth3Component } from './health/heart-health-3/heart-health-3.component';
import { HeartHealth4Component } from './health/heart-health-4/heart-health-4.component';
import { HeartHealth5Component } from './health/heart-health-5/heart-health-5.component';
import { HeartHealth6Component } from './health/heart-health-6/heart-health-6.component';
import { BetterSleep1Component } from './health/better-sleep-1/better-sleep-1.component';
import { BetterSleep2Component } from './health/better-sleep-2/better-sleep-2.component';
import { BetterSleep3Component } from './health/better-sleep-3/better-sleep-3.component';
import { BetterSleep4Component } from './health/better-sleep-4/better-sleep-4.component';
import { UserHomeComponent } from './user-home/user-home.component';
import { ProfileComponent } from './profile/profile.component';
import { UpdatePasswordComponent } from './update-password/update-password.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { DietPlanComponent } from './nutrition/diet-plan/diet-plan.component';
import { MyDietPlanComponent } from './nutrition/my-diet-plan/my-diet-plan.component';
import { AdminComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminUsersComponent } from './admin-users/admin-users.component';
import { AdminDietsComponent } from './admin-diets/admin-diets.component';
import { AdminRequestsComponent } from './admin-requests/admin-requests.component';
import { UserChatComponent } from './user-chat/user-chat.component';
import { AdminChatComponent } from './admin-chat/admin-chat.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { ExercisePlanComponent } from './fitness/exercise-plan/exercise-plan.component';
import { MyExercisePlanComponent } from './fitness/my-exercise-plan/my-exercise-plan.component';
import { AdminExerciseComponent } from './admin-exercise/admin-exercise.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'health', component: HealthComponent },
    //Fitness
    { path: 'fitness', component: FitnessComponent },
    { path: 'exercise-plan', component: ExercisePlanComponent },
    { path: 'my-exercise-plan', component: MyExercisePlanComponent },
    //Nutrition
    { path: 'nutrition', component: NutritionComponent },
    { path: 'diet-plan', component: DietPlanComponent },
    { path: 'my-dietPlan', component: MyDietPlanComponent },
    
    { path: 'sign-in', component: SignInComponent },
    { path: 'subscribe', component: SubscribeComponent },
    { path: 'cart', component: CartComponent },
    { path: 'sign-up', component: SignUpComponent },
    //Health Sections Details ..
    // Brain Health Routes
    { path: 'brain-health-1', component: BrainHealth1Component },
    { path: 'brain-health-2', component: BrainHealth2Component },
    { path: 'brain-health-3', component: BrainHealth3Component },
    { path: 'brain-health-4', component: BrainHealth4Component },
    { path: 'brain-health-5', component: BrainHealth5Component },
    { path: 'brain-health-6', component: BrainHealth6Component },
    // Heart Health Routes
    { path: 'heart-health-1', component: HeartHealth1Component },
    { path: 'heart-health-2', component: HeartHealth2Component },
    { path: 'heart-health-3', component: HeartHealth3Component },
    { path: 'heart-health-4', component: HeartHealth4Component },
    { path: 'heart-health-5', component: HeartHealth5Component },
    { path: 'heart-health-6', component: HeartHealth6Component },
    // Better Sleep Routes
    { path: 'better-sleep-1', component: BetterSleep1Component },
    { path: 'better-sleep-2', component: BetterSleep2Component },
    { path: 'better-sleep-3', component: BetterSleep3Component },
    { path: 'better-sleep-4', component: BetterSleep4Component },
    //Admin-Side
    { path: 'admin-dashboard', component: AdminComponent },
    { path: 'admin-users', component: AdminUsersComponent },
    { path: 'admin-diets', component: AdminDietsComponent },
    { path: 'admin-exercise', component: AdminExerciseComponent },
    { path: 'admin-requests', component: AdminRequestsComponent },
    { path: 'admin-chat/:email', component: AdminChatComponent },
    //User-Side
    { path: 'user-home', component: UserHomeComponent },
    { path: 'profile', component: ProfileComponent },
    { path: 'update-password', component: UpdatePasswordComponent },
    { path: 'forgot-password', component: ForgotPasswordComponent },
    { path: 'user-chat', component: UserChatComponent },
    { path: 'contact', component: ContactUsComponent },


    { path: '**', component: NotFoundComponent }
    

];
