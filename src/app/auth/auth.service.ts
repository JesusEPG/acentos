import { Injectable } from '@angular/core';
import * as urljoin from 'url-join';
import { environment } from '../../environments/environment';
import { User } from './user.model';
import { AdminUser } from './adminUser.model';
import { Headers, Http, Response } from '@angular/http';
//import { JwtHelperService } from '@auth0/angular-jwt';		<-- BORRAR del proyecto
import * as jwt_decode from 'jwt-decode';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';


@Injectable()
export class AuthService {
	usersURL: string;
	currentUser?: User;
	currentAdminUser?: AdminUser;

	constructor(
		private http: Http,
		private router: Router,
		public snackBar: MatSnackBar
	){

		this.usersURL = urljoin(environment.apiUrl, 'auth');
		
		if(this.isLoggedIn()){
			const { userId, userName, firstName, lastName, school, grade } = JSON.parse(localStorage.getItem('user'));
			this.currentUser = new User(userName, null, firstName, lastName, school, grade, userId);
		}
		if(this.isAdminLoggedIn()){
			const { userId, email, firstName, lastName } = JSON.parse(localStorage.getItem('adminUser'));
			this.currentAdminUser = new AdminUser(email, null, firstName, lastName, userId);
		}
	}

	signup(user: User){
		const body = JSON.stringify(user);
		const headers = new Headers({'Content-Type': 'application/json'});
		const url = urljoin(this.usersURL, 'signup');

		return this.http.post(url, body, {headers})
			.map((response: Response) => {
				const json = response.json();
				return json;
			})
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

	signin(user: User){
		const body = JSON.stringify(user);
		const headers = new Headers({'Content-Type': 'application/json'});
		const url = urljoin(this.usersURL, 'signin');
		return this.http.post(url, body, { headers })
			.map((response: Response) => {
				const json = response.json();
				this.login(json);
				return json;
			})
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

	adminSignin(user: AdminUser){
		const body = JSON.stringify(user);
		const headers = new Headers({'Content-Type': 'application/json'});
		const url = urljoin(this.usersURL, 'adminSignin');
		return this.http.post(url, body, { headers })
			.map((response: Response) => {
				const json = response.json();
				this.adminLogin(json);
				return json;
			})
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

	login = ({token, userId, firstName, lastName, userName, grade, school }) => {
		this.currentUser = new User(userName, null, firstName, lastName, school, grade, userId)
		localStorage.setItem('token', token);
		localStorage.setItem('user', JSON.stringify({userId, firstName , lastName, userName, school, grade}));
		this.router.navigateByUrl('/');
	}

	adminLogin = ({adminToken, userId, firstName, lastName, email, role }) => {
		if(this.isLoggedIn()) {
			localStorage.clear();
			this.currentUser = null;
		}
		this.currentAdminUser = new AdminUser(email, null, firstName, lastName, userId, role)
		localStorage.setItem('adminToken', adminToken);
		localStorage.setItem('adminUser', JSON.stringify({userId, firstName , lastName, email, role}));
		this.router.navigateByUrl('/admin');
	}


	isLoggedIn(){
		
		return !this.isTokenExpired();

	}

	isAdminLoggedIn(){
		
		return !this.isAdminTokenExpired()


	}

	logout(){
		localStorage.clear();
		this.currentUser = null;
		this.router.navigateByUrl('/signin');
	}

	adminLogout(){
		localStorage.clear();
		this.currentAdminUser = null;
		this.router.navigateByUrl('/admin/signin');
	}

	getTokenExpirationDate(token: string): Date {
	    const decoded = jwt_decode(token);

	    if (decoded.exp === undefined) return null;

	    const date = new Date(0); 
	    date.setUTCSeconds(decoded.exp);
	    return date;
	}

	getAdminTokenExpirationDate(token: string): Date {
	    const decoded = jwt_decode(token);

	    if (decoded.exp === undefined) return null;

	    const date = new Date(0); 
	    date.setUTCSeconds(decoded.exp);
	    return date;
	}

	isTokenExpired(token?: string): boolean {
	    if(!token) token = this.getToken();
	    if(!token) return true;

	    const date = this.getTokenExpirationDate(token);
	    if(date === undefined) return false;
	    return !(date.valueOf() > new Date().valueOf());
	}

	isAdminTokenExpired(token?: string): boolean {
	    if(!token) token = this.getAdminToken();
	    if(!token) return true;

	    const date = this.getTokenExpirationDate(token);
	    if(date === undefined) return false;
	    return !(date.valueOf() > new Date().valueOf());
	}

	getToken(): string {
	    return localStorage.getItem('token');
	}

	getAdminToken(): string {
	    return localStorage.getItem('adminToken');
	}

	showError(message) {
		//recibe el mensaje, luego lo que queramos colocar para cerrar el mensaje, y las opciones
		this.snackBar.open(message, 'x', { duration: 2500, verticalPosition: 'top'});
	}

	public handleError = (error: any) => {

		const { error: {  name }, message } = error;
		if(name === 'TokenExpiredError'){
			this.showError('Tu sesión ha expirado. Por favor inicia sesión nuevamente');
		} else if (name === 'JsonWebTokenError'){
			this.showError('Ha ocurrido un problema con tu sesión');
		} else {
			this.showError(message || 'Ha ocurrido un error. Intenta de nuevo más tarde');
		}

		this.logout();

	}

	public handleAdminError = (error: any) => {

		const { error: {  name }, message } = error;
		if(name === 'TokenExpiredError'){
			this.showError('Tu sesión ha expirado. Por favor inicia sesión nuevamente');
		} else if (name === 'JsonWebTokenError'){
			this.showError('Ha ocurrido un problema con tu sesión');
		} else {
			this.showError(message || 'Ha ocurrido un error. Intenta de nuevo más tarde');
		}

		this.router.navigateByUrl('/admin');

	}
}