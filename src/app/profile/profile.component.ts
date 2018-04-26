import { Component } from '@angular/core';
import { AuthService } from '../auth/auth.service';


@Component({
	selector: 'app-profile-component',
	templateUrl: './profile.component.html',

})

export class ProfileComponent {

	// Doughnut
	public doughnutChartLabels:string[] = ['Download Sales', 'In-Store Sales', 'Mail-Order Sales'];
	public doughnutChartData:number[] = [350, 450, 100];
	public doughnutChartType:string = 'doughnut';

	constructor(private authService: AuthService) {}

	isLoggedIn() {
		return this.authService.isLoggedIn();
	}

	fullName() {
		return this.authService.currentUser.fullName();
	}

	// events
  	public chartClicked(e:any):void {
    	console.log(e);
	}
 
	public chartHovered(e:any):void {
    	console.log(e);
  	}
}