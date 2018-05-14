import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { ProfileService } from './profile.service';
import { TabDirective } from 'ngx-bootstrap/tabs';


@Component({
	selector: 'app-profile-component',
	templateUrl: './profile.component.html',
	styleUrls: ['./profile.component.css'],
	providers: [ProfileService]

})

export class ProfileComponent implements OnInit {

	//Doughnut general
	public generalChartLabels:string[] = ['Respuestas Correctas', 'Respuestas Incorrectas'];
	public generalChartData:number[] = [];
	public generalChartColors: any[] = [{ backgroundColor: [/*"#b8436d", "#00d9f9", "#a4c73c",*/'#00bfff',"#a4add3", /*"#00cd00"*/] }];
	//public colors:any[] = ['green', 'red', 'blue'];
	public generalChartType:string = 'doughnut';

	// Selection Doughnut
	public selectionChartLabels:string[] = ['Respuestas Correctas', 'Respuestas Incorrectas'];
	public selectionChartData:number[] = [];
	public selectionChartColors: any[] = [{ backgroundColor: ['#00bfff','#a4add3',/*, "#a4c73c", "#a4add3", "#00cd00"*/] }];
	//public colors:any[] = ['green', 'red', 'blue'];
	public selectionChartType:string = 'doughnut';

	// Mistakes Doughnut
	public mistakesChartLabels:string[] = ['Respuestas Correctas', 'Respuestas Incorrectas'];
	public mistakesChartData:number[] = [];
	public mistakesChartColors: any[] = [{ backgroundColor: ['#00bfff','#a4add3',/* "#a4c73c", "#a4add3", "#00cd00"*/] }];
	//public colors:any[] = ['green', 'red', 'blue'];
	public mistakesChartType:string = 'doughnut';

	
	private numberOfActivities:number = 0;
	private numberOfMistakesActivities:number = 0;
	private numberOfSelectionActivities:number = 0;
	private loading = true;
	private data:any[];

	  value: string;
	  onSelect(data: TabDirective): void {
	    this.value = data.heading;
	  }

	constructor(private authService: AuthService, private profileService: ProfileService) {}

	ngOnInit(){

		this.profileService
			.getData()
			.then((data: any[]) => {
				//this.data = data;
				//console.log(this.data);
				/*if(data.length>0){
					//Si hay ejercicios
					if(data[0].totalCorrect>0||data[0].totalIncorrect>0){
						//El usuario ha tenido actividad
						this.generalChartData.push(data[0].totalCorrect);
						this.generalChartData.push(data[0].totalIncorrect);
						this.numberOfActivities = data[0].count;
					}

				}*/

				console.log(data);

				if(data.length===1){

					//Si hay ejercicios de un tipo
					if(data[0].totalCorrect>0||data[0].totalIncorrect>0){
						//El usuario ha tenido actividad en un tipo de actividad
						if(data[0]._id==='Mistake'){
							this.numberOfMistakesActivities = data[0].count;
							this.mistakesChartData.push(data[0].totalCorrect);
							this.mistakesChartData.push(data[0].totalIncorrect);
						} else {
							this.numberOfSelectionActivities = data[0].count;
							this.selectionChartData.push(data[0].totalCorrect);
							this.selectionChartData.push(data[0].totalIncorrect);
						}
						this.generalChartData.push(data[0].totalCorrect);
						this.generalChartData.push(data[0].totalIncorrect);
						this.numberOfActivities = data[0].count;
					}

				} else if(data.length===2) {

					console.log('Entré')

					//Si hay ejercicios de los dos tipos
					if((data[0].totalCorrect>0||data[0].totalIncorrect>0)&&(data[1].totalCorrect>0||data[1].totalIncorrect>0)) {
						//El usuario ha tenido actividad
						data.forEach(function(dataset, index){

							if(dataset._id==='Mistake'){
								this.numberOfMistakesActivities = dataset.count;
								this.selectionChartData.push(dataset.totalCorrect);
								this.selectionChartData.push(dataset.totalIncorrect);
							} else {
								this.numberOfSelectionActivities = dataset.count;
								this.selectionChartData.push(dataset.totalCorrect);
								this.selectionChartData.push(dataset.totalIncorrect);

							}
						}, this)
						
						this.generalChartData.push(data[0].totalCorrect + data[1].totalCorrect);
						this.generalChartData.push(data[0].totalIncorrect + data[1].totalIncorrect);
						this.numberOfActivities = data[0].count + data[1].count;
					} else {

						//Solo hay ejercicios de un tipo
						if(data[0].totalCorrect>0||data[0].totalIncorrect>0){
							//El usuario ha tenido actividad en un tipo de actividad
							if(data[0]._id==='Mistake'){
								this.numberOfMistakesActivities = data[0].count;
							} else {
								this.numberOfSelectionActivities = data[0].count;
							}
							this.generalChartData.push(data[0].totalCorrect);
							this.generalChartData.push(data[0].totalIncorrect);
							this.numberOfActivities = data[0].count;
						}else {
							//El usuario ha tenido actividad en un tipo de actividad
							if(data[1]._id==='Mistake'){
								this.numberOfMistakesActivities = data[1].count;
							} else {
								this.numberOfSelectionActivities = data[1].count;
							}
							this.generalChartData.push(data[1].totalCorrect);
							this.generalChartData.push(data[1].totalIncorrect);
							this.numberOfActivities = data[1].count;
						}

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

	username() {
		return this.authService.currentUser.userName;
	}

	// events
  	public chartClicked(e:any):void {
    	console.log(e);
	}
 
	public chartHovered(e:any):void {
    	console.log(e);
  	}
}