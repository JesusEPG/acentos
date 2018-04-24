import { Injectable } from '@angular/core';
//Models
import { Activity } from './activity.model';
import { SelectionActivity } from './selectionActivity.model';
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
export class ActivitiesService {

	activitiesUrl: string;

	constructor(private http: Http){
		this.activitiesUrl = urljoin(environment.apiUrl, 'activities');
	}

	/*getQuestions(): Promise<void | SelectionActivity[]>{
		return this.http.get(this.activitiesUrl)
			.toPromise()
			.then(response => response.json() as SelectionActivity[])		//Exitoso
			.catch(this.handleError);								//Error
	}*/

	getMistakeActivities(): Promise<void | SelectionActivity[]>{
		const token = this.getToken();
		const url = this.activitiesUrl+ '/mistakes' + token;
		return this.http.get(url)
			.toPromise()
			.then(response => response.json() as SelectionActivity[])		//Exitoso
			.catch(this.handleError);								//Error
	}

	getSelectionActivities(): Promise<void | SelectionActivity[]>{
		const token = this.getToken();
		const url = this.activitiesUrl+ '/selection' + token;
		return this.http.get(url)
			.toPromise()
			.then(response => response.json() as SelectionActivity[])		//Exitoso
			.catch(this.handleError);								//Error
	}

	updateActivities(activities: SelectionActivity[]) {
		const body = JSON.stringify(activities);
		const headers = new Headers({'Content-Type': 'application/json'});
		const token = this.getToken();
		const url = this.activitiesUrl + '/updateActivities' + token;
		return this.http.post(url, body, { headers })
			.map((response: Response) => response.json())
			.catch((error: Response) => Observable.throw(error.json()));
	}

	/*getQuestion(id): Promise<void | Question>{
		const url = urljoin(this.questionsUrl, id);
		return this.http.get(url)
			.toPromise()
			.then(response => response.json() as Question)
			.catch(this.handleError);
	}

	addQuestion(question: Question) {
		const body = JSON.stringify(question);
		const headers = new Headers({'Content-Type': 'application/json'});
		const token = this.getToken();
		const url = this.questionsUrl + token;
		return this.http.post(url, body, { headers })
			.map((response: Response) => response.json())
			.catch((error: Response) => Observable.throw(error.json()));
	}

	addAnswer(answer: Answer) {

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