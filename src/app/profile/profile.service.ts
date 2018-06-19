import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { User } from '../auth/user.model';
//import { SimpleSelectionActivity } from './simpleSelection.model';
//import { Answer } from '../answer/answer.model';
import { Http, Headers, Response } from '@angular/http';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../environments/environment';
//import urljoin from 'url-join';
import * as urljoin from 'url-join';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class ProfileService {

	profileUrl: string;

	constructor(private http: Http,
				public snackBar: MatSnackBar,
				private router: Router,
				private authService: AuthService){
		this.profileUrl = urljoin(environment.apiUrl, 'profile');
	}

	getData(): Promise<void | any[]>{
		const token = this.getToken();
		const url = this.profileUrl + token;
		return this.http.get(url)
			.toPromise()
			.then(response => response.json() as any[])
			.catch((response) => {
				console.log('Catch del profile.service');
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
							return this.getData();
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

	getWeeklyData(): Promise<void | any[]>{
		const token = this.getToken();
		const url = this.profileUrl + '/weekly' + token;
		return this.http.get(url)
			.toPromise()
			.then(response => response.json() as any[])		//Exitoso
			.catch((response) => {
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
							return this.getWeeklyData();
						} else if(res.error.error === 'Usuario no disponible') {
							//Usuario eliminado
							this.snackBar.open(`${res.error.error}. ${res.error.message}`,
												'x',
												{ duration: 2500, verticalPosition: 'top', panelClass: ['snackbar-color'] });
							this.authService.logout()
							this.router.navigateByUrl('/');
						} else {
							this.snackBar.open(`Hubo un problema al traer la información. Intenta más tarde`, 'x', { duration: 2500, verticalPosition: 'top', panelClass: ['snackbar-color'] });
							this.router.navigateByUrl('/');
						}

					} else {
						this.snackBar.open(`Presentamos problema con el servidor. Intenta más tarde`, 'x', { duration: 2500, verticalPosition: 'top', panelClass: ['snackbar-color'] });
						this.router.navigateByUrl('/');
					}
				}
			});
	}

	getMonthlyData(): Promise<void | any[]>{
		const token = this.getToken();
		const url = this.profileUrl + '/monthly' + token;
		return this.http.get(url)
			.toPromise()
			.then(response => response.json() as any[])
			.catch((response) => {
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
							return this.getMonthlyData();
						} else if(res.error.error === 'Usuario no disponible') {
							//Usuario eliminado
							this.snackBar.open(`${res.error.error}. ${res.error.message}`,
												'x',
												{ duration: 2500, verticalPosition: 'top', panelClass: ['snackbar-color'] });
							this.authService.logout()
							this.router.navigateByUrl('/');
						} else {
							this.snackBar.open(`Hubo un problema al traer la información. Intenta más tarde`, 'x', { duration: 2500, verticalPosition: 'top', panelClass: ['snackbar-color'] });
							this.router.navigateByUrl('/');
						}

					} else {
						this.snackBar.open(`Presentamos problema con el servidor. Intenta más tarde`, 'x', { duration: 2500, verticalPosition: 'top', panelClass: ['snackbar-color'] });
						this.router.navigateByUrl('/');
					}
				}
			});
	}

	getToken(){
		const token = localStorage.getItem('token');
		return `?token=${token}`;
	}
}