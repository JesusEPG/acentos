import { ActivitiesComponent } from './activities.component';
import { SelectionActivitiesComponent } from './selectionActivities.component';
//import { QuestionFormComponent } from './question-form.component';

export const ACTIVITIES_ROUTES = [
	{ path: '', component: ActivitiesComponent },
	{ path: 'selection', component: SelectionActivitiesComponent },
	//{ path: ':id', component: QuestionDetailComponent }
];