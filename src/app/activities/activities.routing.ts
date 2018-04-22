import { ActivitiesComponent } from './activities.component';
import { SelectionActivitiesComponent } from './selectionActivities.component';
import { AuthGuard } from '../auth/auth-guard.service';
//import { QuestionFormComponent } from './question-form.component';

export const ACTIVITIES_ROUTES = [
	{ path: '', component: ActivitiesComponent },
	{ path: 'selection', component: SelectionActivitiesComponent, canActivate: [AuthGuard] },
	//{ path: ':id', component: QuestionDetailComponent }
];