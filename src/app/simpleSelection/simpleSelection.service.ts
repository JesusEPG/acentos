import { Injectable } from '@angular/core';
import { SimpleSelectionActivity } from './simpleSelection.model';
import { Http, Headers, Response } from '@angular/http';
import { environment } from '../../environments/environment';
import * as urljoin from 'url-join';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class SimpleSelectionService {

	simpleSelectionUrl: string;

	constructor(private http: Http){
		this.simpleSelectionUrl = urljoin(environment.apiUrl, 'activities');
	}

	getSelectionActivity(id): Promise<void | SimpleSelectionActivity>{
		const token = this.getAdminToken();
		const url = urljoin(this.simpleSelectionUrl, id, token);
		return this.http.get(url)
			.toPromise()
			.then(response => response.json() as SimpleSelectionActivity)
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

	addSimpleSelectionActivity(activity: SimpleSelectionActivity) {
		const body = JSON.stringify(activity);
		const headers = new Headers({'Content-Type': 'application/json'});
		const token = this.getAdminToken();
		const url = this.simpleSelectionUrl + '/newSelectionActivity' + token;
		//  apiUrl: 'http://localhost:3000/api/simpleSelection?token=${token}'
		return this.http.post(url, body, { headers })
			.map((response: Response) => response.json())
			.catch((error: Response) => Observable.throw(error.json()));
	}

	updateSelectionActivity(activity: SimpleSelectionActivity) {
		const body = JSON.stringify(activity);
		const headers = new Headers({'Content-Type': 'application/json'});
		const token = this.getAdminToken();
		const url = this.simpleSelectionUrl + '/updateActivity' + token;
		//  apiUrl: 'http://localhost:3000/api/simpleSelection?token=${token}'
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
		const errMsg = error.message ? error.message :
			error.status ? `${error.status} - ${error.statusText}` : 'Server error';

	}
}