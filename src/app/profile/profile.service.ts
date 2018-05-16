import { Injectable } from '@angular/core';
//import { SimpleSelectionActivity } from './simpleSelection.model';
//import { Answer } from '../answer/answer.model';
import { Http, Headers, Response } from '@angular/http';
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

	constructor(private http: Http){
		this.profileUrl = urljoin(environment.apiUrl, 'profile');
	}

	getData(): Promise<void | any[]>{
		const token = this.getToken();
		const url = this.profileUrl + token;
		return this.http.get(url)
			.toPromise()
			.then(response => response.json() as any[])		//Exitoso
			.catch(this.handleError);								//Error
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