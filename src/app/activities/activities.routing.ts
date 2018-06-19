import { ActivitiesComponent } from './activities.component';
import { SelectionActivitiesComponent } from './selectionActivities.component';
import { MistakeActivitiesComponent } from './mistakeActivities.component';
import { AuthGuard } from '../auth/auth-guard.service';
import { SessionGuard } from './session-guard.service';

export const ACTIVITIES_ROUTES = [
	{ path: '', component: ActivitiesComponent },
	{ path: 'selection', component: SelectionActivitiesComponent, canActivate: [AuthGuard], canDeactivate: [SessionGuard] },
	{ path: 'mistake', component: MistakeActivitiesComponent, canActivate: [AuthGuard], canDeactivate: [SessionGuard] },
];