import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { ProfileService } from './profile.service';


@Component({
	selector: 'app-profile-component',
	templateUrl: './profile.component.html',
	styleUrls: ['./profile.component.css'],
	providers: [ProfileService]

})

export class ProfileComponent implements OnInit {

	// Doughnut
	public doughnutChartLabels:string[] = ['Respuestas Correctas', 'Respuestas Incorrectas'];
	public doughnutChartData:number[] = [];
	public doughnutChartColors: any[] = [{ backgroundColor: [/*"#b8436d", "#00d9f9", "#a4c73c",*/"#a4add3", "#00cd00"] }];
	//public colors:any[] = ['green', 'red', 'blue'];
	public doughnutChartType:string = 'doughnut';

	// General Doughnut
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
				//this.data = data;
				//console.log(this.data);
				if(data.length>0){
					//Si hay ejercicios
					if(this.data[0].totalCorrect>0||this.data[0].totalIncorrect>0){
						//El usuario ha tenido actividad
						this.generalChartData.push(this.data[0].totalCorrect);
						this.generalChartData.push(this.data[0].totalIncorrect);
					}

				}
				//Si correctos en incorrectos es 0 (no se ha intententado), no genera error pero hay que validar
				//Si no hay ejercicios devuelve un arreglo vacio
				//Validar si hay ejercicios, de haberlos, verificar que hayan sido intentados
				//es decir, si hay algun correcto o incorrecto
				//this.generalChartData.push(this.data[0].totalCorrect);
				//this.generalChartData.push(this.data[0].totalIncorrect);
				/*this.doughnutChartData.push(this.data[1].totalCorrect);
				this.doughnutChartData.push(this.data[1].totalIncorrect);*/

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