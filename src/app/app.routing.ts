import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { LandingComponent } from './landing/landing.component';
import { SigninComponent } from './auth/signin.component';
import { SignupComponent } from './auth/signup.component';
import { ProfileComponent } from './profile/profile.component';
import { AuthGuard } from './auth/auth-guard.service';
import { SigninGuard } from './auth/signin-guard.service';
import { ActivitiesComponent } from './activities/activities.component';
import { SimpleSelectionComponent } from './simpleSelection/simpleSelection.component';
import { SelectionActivitiesComponent } from './activities/selectionActivities.component';
import { ACTIVITIES_ROUTES } from './activities/activities.routing';
import { ADMIN_ROUTES } from './admin/admin.routing';


const APP_ROUTES: Routes = [
	{ path: '', component: LandingComponent, pathMatch: 'full' },
	{ path: 'signin', component: SigninComponent, canActivate: [SigninGuard] },
	{ path: 'signup', component: SignupComponent },
	{ path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
	{ path: 'activities', children: ACTIVITIES_ROUTES, canActivate: [AuthGuard] },
	{ path: 'admin', children: ADMIN_ROUTES },
	{ path: 'simpleSelection', component: SimpleSelectionComponent}
];

export const Routing = RouterModule.forRoot(APP_ROUTES);

