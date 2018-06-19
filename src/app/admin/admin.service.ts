import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from '../auth/user.model';
import { Activity } from './activity.model';
import { Http, Headers, Response } from '@angular/http';
import { environment } from '../../environments/environment';
import * as urljoin from 'url-join';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class AdminService {

	adminUrl: string;

	constructor(private http: Http,
				private router: Router,
				public snackBar: MatSnackBar){
		this.adminUrl = urljoin(environment.apiUrl, 'admin');
	}

	getUsers(): Promise<void | User[]>{
		const token = this.getAdminToken();
		return this.http.get(this.adminUrl+ '/users' + token)
			.toPromise()
			.then(response => response.json() as User[])
			.catch((response) => {
				const res = response.json();
				
				if(res){
					if(res.message){
						
						//Error arrojado desde el servidor
						throw new Error(res.message);
					} else {
							
						//Error por servidor caído
						throw new Error('Presentamos problema con el servidor. Intenta más tarde');
					}
				}
			});
	}

	getUser(id): Promise<void | User>{
		const token = this.getAdminToken();
		const url = urljoin(this.adminUrl, 'user', id, token);
		return this.http.get(url)
			.toPromise()
			.then(response => response.json() as User)
			.catch((response) => {
				const res = response.json();
				
				if(res){
					if(res.message){
						
						//Error arrojado desde el servidor
						throw new Error(res.message);
					} else {
							
						//Error por servidor caído
						throw new Error('Presentamos problema con el servidor. Intenta más tarde');
					}
				}
			});
	}

	getActivities(): Promise<void | Activity[]>{
		const token = this.getAdminToken();
		return this.http.get(this.adminUrl+'/activities'+token)
			.toPromise()
			.then(response => response.json() as Activity[])
			.catch((response) => {
				const res = response.json();
				
				if(res){
					if(res.message){
						
						//Error arrojado desde el servidor
						throw new Error(res.message);
					} else {
							
						//Error por servidor caído
						throw new Error('Presentamos problema con el servidor. Intenta más tarde');
					}
				}
			});	
	}

	updateUser(user: User) {
		const body = JSON.stringify(user);
		const headers = new Headers({'Content-Type': 'application/json'});
		const token = this.getAdminToken();
		const url = this.adminUrl + '/updateUser' + token;
		return this.http.post(url, body, { headers })
			.map((response: Response) => response.json())
			.catch((error: Response) => {

				const res = error.json();
				
				if(res){
					if(res.message){
						
						//Error arrojado desde el servidor
						return Observable.throw(res);

					} else {
							
						//Error por servidor caído
						return Observable.throw('Presentamos problema con el servidor. Intenta más tarde');
					}
				}

			});
	}

	deleteActivity(activityId) {
		const body = JSON.stringify({_id: activityId});
		const headers = new Headers({'Content-Type': 'application/json'});
		const token = this.getAdminToken();
		const url = this.adminUrl + '/deleteActivity' + token;

		return this.http.post(url, body, { headers })
			.map((response: Response) => response.json())
			.catch((error: Response) => {

				const res = error.json();
				
				if(res){
					if(res.message){
						
						//Error arrojado desde el servidor
						return Observable.throw(res.message);

					} else {
							
						//Error por servidor caído
						return Observable.throw('Presentamos problema con el servidor. Intenta más tarde');
					}
				}

			});
	}

	deleteUser(userId) {
		//Obtener adminToken y asignarlo al body
		const body = JSON.stringify({_id: userId});
		const headers = new Headers({'Content-Type': 'application/json'});
		const token = this.getAdminToken();
		const url = this.adminUrl + '/deleteUser' + token;

		return this.http.post(url, body, { headers })
			.map((response: Response) => response.json())
			.catch((error: Response) => {

				const res = error.json();
				
				if(res){
					if(res.message){
						
						//Error arrojado desde el servidor
						return Observable.throw(res.message);

					} else {
							
						//Error por servidor caído
						return Observable.throw('Presentamos problema con el servidor. Intenta más tarde');
					}
				}

			});
	}

	getToken(){
		const token = localStorage.getItem('token');
		return `?token=${token}`;
	}

	getAdminToken(){
		const token = localStorage.getItem('adminToken');
		return `?token=${token}`;
	}

	handleError(error: any) {
		console.log('Entré al catch de handleerror en admin service');
		console.log(error);
		const errMsg = error.message ? error.message :
		error.status ? `${error.status} - ${error.statusText}` : 'Presentamos problemas con el servidor. Intenta más tarde';
		
	}
}