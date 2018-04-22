import { AdminDashboardComponent } from './adminDashboard.component';
import { SimpleSelectionComponent } from '../simpleSelection/simpleSelection.component';
import { AdminActivitiesComponent } from './adminActivities.component';
import { MistakesComponent } from '../mistakes/mistakes.component';
import { AdminSigninComponent } from './adminSignin.component';
//import { ActivitiesComponent } from './activities.component';
//import { SelectionActivitiesComponent } from './selectionActivities.component';
//import { QuestionFormComponent } from './question-form.component';

export const ADMIN_ROUTES = [
	{ path: '', component: AdminDashboardComponent },
	{ path: 'signin', component: AdminSigninComponent  },
	{ path: 'activities', component: AdminActivitiesComponent },
	{ path: 'activities/newSelectionActivity', component: SimpleSelectionComponent },
	{ path: 'activities/mistakesActivity', component: MistakesComponent }

	//{ path: ':id', component: QuestionDetailComponent }
];