import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { LandingComponent } from './landing/landing.component';
import { SigninComponent } from './auth/signin.component';
import { SignupComponent } from './auth/signup.component';
import { ProfileComponent } from './profile/profile.component';
//import { QUESTION_ROUTES } from './question/question.routing';


const APP_ROUTES: Routes = [
	{ path: '', component: LandingComponent, pathMatch: 'full' },
	{ path: 'signin', component: SigninComponent },
	{ path: 'signup', component: SignupComponent },
	{ path: 'profile', component: ProfileComponent }
	//{ path: 'questions', children: QUESTION_ROUTES }
];

export const Routing = RouterModule.forRoot(APP_ROUTES);

