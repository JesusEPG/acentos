import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { ProfileService } from './profile.service';


@Component({
	selector: 'app-profile-component',
	templateUrl: './profile.component.html',
	providers: [ProfileService]

})

export class ProfileComponent implements OnInit {

	// Doughnut
	public doughnutChartLabels:string[] = ['Download Sales', 'In-Store Sales', 'Mail-Order Sales'];
	public doughnutChartData:number[] = [350, 450, 100, 200, 300];
	public doughnutChartColors: any[] = [{ backgroundColor: ["#b8436d", "#00d9f9", "#a4c73c", "#a4add3", "#00cd00"] }];
	//public colors:any[] = ['green', 'red', 'blue'];
	public doughnutChartType:string = 'doughnut';

	// Doughnut
	public generalChartLabels:string[] = ['Respuestas Correctas', 'Respuestas Incorrectas'];
	public generalChartData:number[] = [];
	public generalChartColors: any[] = [{ backgroundColor: ["#b8436d", "#00d9f9"/*, "#a4c73c", "#a4add3", "#00cd00"*/] }];
	//public colors:any[] = ['green', 'red', 'blue'];
	public generalChartType:string = 'doughnut';


	private loading = true;
	private data:any[];

	constructor(private authService: AuthService, private profileService: ProfileService) {}

	ngOnInit(){

		this.profileService
			.getData()
			.then((data: any[]) => {
				this.data = data;
				console.log(this.data);
				this.generalChartData.push(this.data[0].totalCorrect);
				this.generalChartData.push(this.data[0].totalIncorrect);
				this.loading = false;
			})
			.catch((err: any) => {
				console.log('Entre al error')
				console.log('Error ' + err);
				//this.loading = false;
			});
	}

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