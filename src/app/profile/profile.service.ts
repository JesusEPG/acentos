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
		console.log(this.profileUrl)
	}

	/*getQuestions(): Promise<void | SimpleSelectionActivity[]>{
		return this.http.get(this.simpleSelectionUrl)
			.toPromise()
			.then(response => response.json() as SimpleSelectionActivity[])		//Exitoso
			.catch(this.handleError);								//Error
	}


	getSelectionActivity(id): Promise<void | SimpleSelectionActivity>{
		const url = urljoin(this.simpleSelectionUrl, id);
		return this.http.get(url)
			.toPromise()
			.then(response => response.json() as SimpleSelectionActivity)
			.catch(this.handleError);
	}*/

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

	/*addSimpleSelectionActivity(activity: SimpleSelectionActivity) {
		const body = JSON.stringify(activity);
		const headers = new Headers({'Content-Type': 'application/json'});
		const token = this.getToken();
		const url = this.simpleSelectionUrl + '/newSelectionActivity' + token;
		//  apiUrl: 'http://localhost:3000/api/simpleSelection?token=${token}'
		return this.http.post(url, body, { headers })
			.map((response: Response) => response.json())
			.catch((error: Response) => Observable.throw(error.json()));
	}

	updateSelectionActivity(activity: SimpleSelectionActivity) {
		const body = JSON.stringify(activity);
		const headers = new Headers({'Content-Type': 'application/json'});
		//const token = this.getToken();
		const url = this.simpleSelectionUrl + '/updateActivity';
		//  apiUrl: 'http://localhost:3000/api/simpleSelection?token=${token}'
		return this.http.post(url, body, { headers })
			.map((response: Response) => response.json())
			.catch((error: Response) => Observable.throw(error.json()));
	}*/

	/*addAnswer(answer: Answer) {

		const a = {
			description: answer.description,
			question: {
				_id: answer.question._id
			}
		}

		const body = JSON.stringify(a);
		const headers = new Headers({'Content-Type': 'application/json'});
		const token = this.getToken();
		//const url = urljoin(this.questionsUrl, answer.question._id, 'answers'); //en strings los aspectos de la ruta que no son parametros
		return this.http.post(`${this.questionsUrl}/${answer.question._id}/answers${token}`, body, { headers })
			.map((response: Response) => response.json())
			.catch((error: Response) => Observable.throw(error.json()));
	}*/

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