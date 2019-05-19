import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { User } from '../auth/user.model';
import { Activity } from './activity.model';
import { SelectionActivity } from './selectionActivity.model';
import { Http, Headers, Response } from '@angular/http';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as urljoin from 'url-join';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class ActivitiesService {

	activitiesUrl: string;

	constructor(private http: Http,
				private authService: AuthService,
				public snackBar: MatSnackBar,
				private router: Router){
		this.activitiesUrl = urljoin(environment.apiUrl, 'activities');
	}
	
	getActivities(activityType: string): Promise<void | SelectionActivity[]>{
		const token = this.getToken();
		// const url = this.activitiesUrl + '/selection' + token;
		const url = this.activitiesUrl + '/activities' + token + `&&type=${activityType}`;
		return this.http.get(url)
			.toPromise()
			.then(response => response.json() as SelectionActivity[])
			.catch((response) => {
				console.log('Catch del mistakesActivities.service');
				const res = response.json();

				if(res){
					if(res.error){
						if(res.error.error === 'Usuario modificado'){
							console.log('Modificado');
							this.snackBar.open(`${res.error.error}. ${res.error.message}`,
												'x',
												{ duration: 2500, verticalPosition: 'top', panelClass: ['snackbar-color']});
							
							localStorage.clear();

							this.authService.currentUser = new User(res.userName,
																	null,
																	res.firstName,
																	res.lastName,
																	res.school,
																	res.grade,
																	res.userId);
							
							localStorage.setItem('token', res.token);
							localStorage.setItem('user', JSON.stringify({userId: res.userId,
																		firstName: res.firstName,
																		lastName: res.lastName,
																		userName: res.userName,
																		school: res.school,
																		grade: res.grade}));
							return this.getActivities(activityType);
						} else if (res.error.error === 'Usuario no disponible') {
							//Usuario eliminado
							this.snackBar.open(`${res.error.error}. ${res.error.message}`,
												'x',
												{ duration: 2500, verticalPosition: 'top', panelClass: ['snackbar-color'] });
							this.authService.logout()
							this.router.navigateByUrl('/');
						} else {
							this.snackBar.open(`Hubo un problema al traer la información. Intenta más tarde`,
												'x',
												{ duration: 2500, verticalPosition: 'top', panelClass: ['snackbar-color'] });
							this.router.navigateByUrl('/');
						}

					} else {
						this.snackBar.open(`Presentamos problema con el servidor. Intenta más tarde`,
											'x',
											{ duration: 2500, verticalPosition: 'top', panelClass: ['snackbar-color']});
						this.router.navigateByUrl('/');
					}
				}
			});
	}

	updateActivities(activities: SelectionActivity[]) {
		const body = JSON.stringify(activities);
		const headers = new Headers({'Content-Type': 'application/json'});
		const token = this.getToken();
		const url = this.activitiesUrl + '/updateActivities' + token;
		return this.http.post(url, body, { headers })
			.map((response: Response) => response.json())
			.catch((response) => {
				console.log('Catch del mistakesActivities.service');
				const res = response.json();

				if(res){
					if(res.error){
						if(res.error.error === 'Usuario modificado'){
							this.snackBar.open(`${res.error.error}. ${res.error.message}`,
												'x',
												{ duration: 2500, verticalPosition: 'top', panelClass: ['snackbar-color']});
							
							localStorage.clear();

							this.authService.currentUser = new User(res.userName,
																	null,
																	res.firstName,
																	res.lastName,
																	res.school,
																	res.grade,
																	res.userId);
							
							localStorage.setItem('token', res.token);
							localStorage.setItem('user', JSON.stringify({userId: res.userId,
																		firstName: res.firstName,
																		lastName: res.lastName,
																		userName: res.userName,
																		school: res.school,
																		grade: res.grade}));
							return this.updateActivities(activities);
						} else if (res.error.error === 'Usuario no disponible') {
							//Usuario eliminado
							this.snackBar.open(`${res.error.error}. ${res.error.message}`,
												'x',
												{ duration: 2500, verticalPosition: 'top', panelClass: ['snackbar-color'] });
							this.authService.logout()
							this.router.navigateByUrl('/');
						} else {
							this.snackBar.open(`Hubo un problema al traer la información. Intenta más tarde`,
												'x',
												{ duration: 2500, verticalPosition: 'top', panelClass: ['snackbar-color'] });
							this.router.navigateByUrl('/');
						}

					} else {
						this.snackBar.open(`Presentamos problema con el servidor. Intenta más tarde`,
											'x',
											{ duration: 2500, verticalPosition: 'top', panelClass: ['snackbar-color']});
						this.router.navigateByUrl('/');
					}
				}
			});
	}

	updateTakenActivities(activities: SelectionActivity[]) {
		const body = JSON.stringify(activities);
		const headers = new Headers({'Content-Type': 'application/json'});
		const token = this.getToken();
		const url = this.activitiesUrl + '/updateActivities' + token;
		return this.http.post(url, body, { headers })
			.map((response: Response) => response.json())
			.catch((error: Response) => Observable.throw(error.json()));
	}

	/*updateLostActivities(activities: SelectionActivity[]) {
		console.log('Actividades');
		console.log(activities);
		const body = JSON.stringify(activities);
		const headers = new Headers({'Content-Type': 'application/json'});
		const token = this.getToken();
		const url = this.activitiesUrl + '/updateLostActivities' + token;
		return this.http.post(url, body, { headers })
			.map((response: Response) => response.json())
			.catch((error: Response) => Observable.throw(error.json()));

	}*/

	getToken(){
		const token = localStorage.getItem('token');
		return `?token=${token}`;
	}
}