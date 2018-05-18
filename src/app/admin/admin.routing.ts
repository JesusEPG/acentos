import { AdminDashboardComponent } from './adminDashboard.component';
import { SimpleSelectionComponent } from '../simpleSelection/simpleSelection.component';
import { AdminActivitiesComponent } from './adminActivities.component';
import { AdminUsersComponent } from './adminUsers.component';
import { MistakesComponent } from '../mistakes/mistakes.component';
import { UpdateMistakeActivityComponent } from '../mistakes/updateMistakeActivity.component';
import { UpdateSelectionActivityComponent } from '../simpleSelection/updateSelectionActivity.component';
import { AdminSigninComponent } from './adminSignin.component';
import { AdminGuardService } from '../auth/admin-guard.service';
import { AdminSigninGuard } from '../auth/adminSignin-guard.service';
import { UserListComponent } from './userList.component';
import { ActivityListComponent } from './activityList.component';
import { UpdateUserComponent } from './updateUser.component';
import { AdminUserSignupComponent } from './adminUserSignup.component';
//import { ActivitiesComponent } from './activities.component';
//import { SelectionActivitiesComponent } from './selectionActivities.component';
//import { QuestionFormComponent } from './question-form.component';

export const ADMIN_ROUTES = [
	{ path: '', component: AdminDashboardComponent, canActivate: [AdminGuardService]},
	{ path: 'signin', component: AdminSigninComponent, canActivate: [AdminSigninGuard] },
	{ path: 'activities', component: AdminActivitiesComponent, canActivate: [AdminGuardService]},
	{ path: 'activities/newSelectionActivity', component: SimpleSelectionComponent, canActivate: [AdminGuardService]},
	{ path: 'activities/mistakesActivity', component: MistakesComponent, canActivate: [AdminGuardService] },
	{ path: 'activities/activityList', component: ActivityListComponent, canActivate:[AdminGuardService]},
	{ path: 'activities/activityList/updateMistakeActivity/:_id', component: UpdateMistakeActivityComponent, canActivate:[AdminGuardService]},
	{ path: 'activities/activityList/updateSelectionActivity/:_id', component: UpdateSelectionActivityComponent, canActivate:[AdminGuardService]},
	{ path: 'users', component: AdminUsersComponent, canActivate: [AdminGuardService]},
	{ path: 'users/signup', component: AdminUserSignupComponent, canActivate: [AdminGuardService]},
	{ path: 'users/userList', component: UserListComponent, canActivate:[AdminGuardService]},
	{ path: 'users/userList/updateUser/:_id', component: UpdateUserComponent, canActivate:[AdminGuardService]}

	//{ path: ':id', component: QuestionDetailComponent }
];