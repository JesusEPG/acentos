import { Injectable } from '@angular/core';
import * as urljoin from 'url-join';
import { environment } from '../../environments/environment';
import { User } from './user.model';
import { AdminUser } from './adminUser.model';
import { Headers, Http, Response } from '@angular/http';
//import { JwtHelperService } from '@auth0/angular-jwt';		<-- BORRAR del proyecto
import * as jwt_decode from 'jwt-decode';
import { Observable } from 'rxjs/Observable';
//import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import { Router } from '@angular/router';
//import { MatSnackBar } from '@angular/material/snack-bar';
//import { AlertComponent } from 'ngx-bootstrap/alert/alert.component';


@Injectable()
export class AuthService {
	usersURL: string;
	currentUser?: User;
	currentAdminUser?: AdminUser;

	constructor(
		private http: Http,
		private router: Router,
		/*,	public snackBar: MatSnackBar*/
	){

		//'http://localhost:3000/api/auth'
		this.usersURL = urljoin(environment.apiUrl, 'auth');
		
		if(this.isLoggedIn()){
			const { userId, userName, firstName, lastName } = JSON.parse(localStorage.getItem('user'));
			this.currentUser = new User(userName, null, firstName, lastName, userId);
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
				console.log(error);
				return Observable.throw(error.json());

			});
	}

	signin(user: User){
		const body = JSON.stringify(user);
		const headers = new Headers({'Content-Type': 'application/json'});
		const url = urljoin(this.usersURL, 'signin');
		//const url = urljoin(this.questionsUrl, answer.question._id, 'answers');

		////'http://localhost:3000/api/auth' + signin
		return this.http.post(url, body, { headers })
			.map((response: Response) => {
				const json = response.json(); //Lo que responde la ruta
				this.login(json);
				return json;
			})
			.catch((error: Response) => {
				console.log(error);
				return Observable.throw(error.json());
			});
	}

	adminSignin(user: AdminUser){
		const body = JSON.stringify(user);
		const headers = new Headers({'Content-Type': 'application/json'});
		const url = urljoin(this.usersURL, 'adminSignin');
		//const url = urljoin(this.questionsUrl, answer.question._id, 'answers');

		////'http://localhost:3000/api/auth' + signin
		return this.http.post(url, body, { headers })
			.map((response: Response) => {
				const json = response.json(); //Lo que responde la ruta
				this.adminLogin(json);
				return json;
			})
			.catch((error: Response) => {
				console.log(error);
				return Observable.throw(error.json());
			});
	}

	login = ({token, userId, firstName, lastName, userName }) => {
		this.currentUser = new User(userName, null, firstName, lastName, userId)
		localStorage.setItem('token', token);
		localStorage.setItem('user', JSON.stringify({userId, firstName , lastName, userName}));
		this.router.navigateByUrl('/');
	}

	adminLogin = ({adminToken, userId, firstName, lastName, email, role }) => {
		this.currentAdminUser = new AdminUser(email, null, firstName, lastName, userId, role)
		localStorage.setItem('adminToken', adminToken);
		localStorage.setItem('adminUser', JSON.stringify({userId, firstName , lastName, email, role}));
		this.router.navigateByUrl('/admin');
	}


	isLoggedIn(){
		
		//console.log(this.isTokenExpired());
		//return localStorage.getItem('token') !== null;
		return !this.isTokenExpired();

	}

	isAdminLoggedIn(){
		
		//console.log(this.isTokenExpired());
		//return localStorage.getItem('token') !== null;

		//const adminToken = this.getAdminToken();

		// decode the token to get its payload
    	//const tokenPayload = jwt_decode(adminToken);

		//return !this.isAdminTokenExpired() && tokenPayload.role === 'admin'
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
	    console.log(`La fecha de expiración es: ${date}`);
	    if(date === undefined) return false;
	    return !(date.valueOf() > new Date().valueOf());
	}

	isAdminTokenExpired(token?: string): boolean {
	    if(!token) token = this.getAdminToken();
	    if(!token) return true;

	    const date = this.getTokenExpirationDate(token);
	    console.log(`La fecha de expiración es: ${date}`);
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
		//this.snackBar.open(message, 'x', { duration: 2500 });
		console.log(message);
	}

	/*showError(message) {
		//recibe el mensaje, luego lo que queramos colocar para cerrar el mensaje, y las opciones
		//this.snackBar.open(message, 'x', { duration: 2500 });
		console.log(message);
		return {
					type: 'warning',
				    msg: message,
				    timeout: 2500
				};
	}*/

	public handleError = (error: any) => {

		const { error: {  name }, message } = error;
		if(name === 'TokenExpiredError'){
			this.showError('Your session has expired');
		} else if (name === 'JsonWebTokenError'){
			this.showError('A problem has occurred with your session');
		} else {
			this.showError(message || 'An error has occurred. Try again');
		}

		this.logout();

	}
}