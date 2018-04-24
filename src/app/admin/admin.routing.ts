import { AdminDashboardComponent } from './adminDashboard.component';
import { SimpleSelectionComponent } from '../simpleSelection/simpleSelection.component';
import { AdminActivitiesComponent } from './adminActivities.component';
import { MistakesComponent } from '../mistakes/mistakes.component';
import { AdminSigninComponent } from './adminSignin.component';
import { AdminGuardService } from '../auth/admin-guard.service';
//import { ActivitiesComponent } from './activities.component';
//import { SelectionActivitiesComponent } from './selectionActivities.component';
//import { QuestionFormComponent } from './question-form.component';

export const ADMIN_ROUTES = [
	{ path: '', component: AdminDashboardComponent, canActivate: [AdminGuardService]},
	{ path: 'signin', component: AdminSigninComponent  },
	{ path: 'activities', component: AdminActivitiesComponent, canActivate: [AdminGuardService]},
	{ path: 'activities/newSelectionActivity', component: SimpleSelectionComponent, canActivate: [AdminGuardService]},
	{ path: 'activities/mistakesActivity', component: MistakesComponent, canActivate: [AdminGuardService] }

	//{ path: ':id', component: QuestionDetailComponent }
];