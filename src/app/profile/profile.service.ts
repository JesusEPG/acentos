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
			.then(response => response.json() as any[])		//Exitoso
			//.catch(this.handleError);								//Error
			.catch((response) => {
				console.log('Catch del profile.service');
				const res = response.json();

				console.log(res);
				console.log(res.error);

				if(res){
					if(res.error){
						
						if(res.error.error === 'Usuario modificado'){
							this.snackBar.open(`${res.error.error}. ${res.error.message}`, 'x', { duration: 2500, verticalPosition: 'top'});
							//this.authService.logout()
							localStorage.clear();
							//this.authService.currentUser = null;

							this.authService.currentUser = new User(res.userName, null, res.firstName, res.lastName, res.userId);
							//localStorage.setItem('token', JSON.stringify({token: res.token});
							localStorage.setItem('token', res.token);

							localStorage.setItem('user', JSON.stringify({userId: res.userId,
																		 firstName: res.firstName,
																		 lastName: res.lastName,
																		 userName: res.userName}));
							return this.getData();
							//this.router.navigateByUrl('/');
						} else {
							this.snackBar.open(`${res.error.error}. ${res.error.message}`, 'x', { duration: 2500, verticalPosition: 'top'});
							//this.authService.logout()
							//this.getMistakeActivities()
							this.router.navigateByUrl('/');
						}

					} else {
						this.snackBar.open(`Presentamos problema con el servidor. Intentar más tarde`, 'x', { duration: 2500, verticalPosition: 'top'});
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
			.catch(this.handleError);								//Error
	}

	getMonthlyData(): Promise<void | any[]>{
		const token = this.getToken();
		const url = this.profileUrl + '/monthly' + token;
		return this.http.get(url)
			.toPromise()
			.then(response => response.json() as any[])		//Exitoso
			.catch(this.handleError);								//Error
	}

	getToken(){
		const token = localStorage.getItem('token');
		return `?token=${token}`;
	}

	handleError(error: any) {
		const errMsg = error.message ? error.message :
			error.status ? `${error.status} - ${error.statusText}` : 'Server error';

		console.log(errMsg);
	}
}