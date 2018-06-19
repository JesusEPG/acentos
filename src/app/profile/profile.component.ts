import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { ProfileService } from './profile.service';
import { TabDirective } from 'ngx-bootstrap/tabs';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
	selector: 'app-profile-component',
	templateUrl: './profile.component.html',
	styleUrls: ['./profile.component.css'],
	providers: [ProfileService]

})

export class ProfileComponent implements OnInit {

	//Datos generales
	//Doughnut general
	public generalChartLabels:string[] = ['Respuestas Correctas', 'Respuestas Incorrectas'];
	public generalChartData:number[] = [];
	public generalChartColors: any[] = [{ backgroundColor: [/*"#b8436d", "#00d9f9", "#a4c73c",*/'#00bfff',"#a4add3", /*"#00cd00"*/] }];
	public generalChartType:string = 'doughnut';

	// Selection Doughnut
	public selectionChartLabels:string[] = ['Respuestas Correctas', 'Respuestas Incorrectas'];
	public selectionChartData:number[] = [];
	public selectionChartColors: any[] = [{ backgroundColor: ['#00bfff','#a4add3',/*, "#a4c73c", "#a4add3", "#00cd00"*/] }];
	public selectionChartType:string = 'doughnut';

	// Mistakes Doughnut
	public mistakesChartLabels:string[] = ['Respuestas Correctas', 'Respuestas Incorrectas'];
	public mistakesChartData:number[] = [];
	public mistakesChartColors: any[] = [{ backgroundColor: ['#00bfff','#a4add3',/* "#a4c73c", "#a4add3", "#00cd00"*/] }];
	public mistakesChartType:string = 'doughnut';

	
	private numberOfActivities:number = 0;
	private numberOfMistakesActivities:number = 0;
	private numberOfSelectionActivities:number = 0;
	private loading = true;
	private data:any[];

	//Datos semanales
	//Doughnut general
	public generalWeeklyChartLabels:string[] = ['Respuestas Correctas', 'Respuestas Incorrectas'];
	public generalWeeklyChartData:number[] = [];
	public generalWeeklyChartColors: any[] = [{ backgroundColor: [/*"#b8436d", "#00d9f9", "#a4c73c",*/'#00bfff',"#a4add3", /*"#00cd00"*/] }];
	public generalWeeklyChartType:string = 'doughnut';

	// Selection Doughnut
	public selectionWeeklyChartLabels:string[] = ['Respuestas Correctas', 'Respuestas Incorrectas'];
	public selectionWeeklyChartData:number[] = [];
	public selectionWeeklyChartColors: any[] = [{ backgroundColor: ['#00bfff','#a4add3',/*, "#a4c73c", "#a4add3", "#00cd00"*/] }];
	public selectionWeeklyChartType:string = 'doughnut';

	// Mistakes Doughnut
	public mistakesWeeklyChartLabels:string[] = ['Respuestas Correctas', 'Respuestas Incorrectas'];
	public mistakesWeeklyChartData:number[] = [];
	public mistakesWeeklyChartColors: any[] = [{ backgroundColor: ['#00bfff','#a4add3',/* "#a4c73c", "#a4add3", "#00cd00"*/] }];
	public mistakesWeeklyChartType:string = 'doughnut';

	
	private numberOfWeeklyActivities:number = 0;
	private numberOfWeeklyMistakesActivities:number = 0;
	private numberOfWeeklySelectionActivities:number = 0;
	//private loading = true;
	//private data:any[];

	private value: string;
	

	constructor(private authService: AuthService,
				public snackBar: MatSnackBar,
				private router: Router,
				private profileService: ProfileService) {}

	ngOnInit(){

		this.profileService
			.getData()
			.then((data: any[]) => {

				if (data){

					if(data.length===1){
						console.log('Entré a 1');
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

						console.log('Entré a 2');

						//Si hay ejercicios de los dos tipos
						if((data[0].totalCorrect>0||data[0].totalIncorrect>0)&&(data[1].totalCorrect>0||data[1].totalIncorrect>0)) {
							//El usuario ha tenido actividad
							data.forEach(function(dataset, index){

								if(dataset._id==='Mistake'){
									this.numberOfMistakesActivities = dataset.count;
									this.mistakesChartData.push(dataset.totalCorrect);
									this.mistakesChartData.push(dataset.totalIncorrect);
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
				}

				this.loading = false;
			})
			.catch((err: any) => {
				this.snackBar.open(`Hubo un problema al traer la información. Intenta más tarde`,
									'x',
									{ duration: 2500, verticalPosition: 'top', panelClass: ['snackbar-color'] });
				this.router.navigateByUrl('/');
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

	grade() {
		return this.authService.currentUser.grade;
	}

	school() {
		return this.authService.currentUser.school;
	}

	onSelect(data: TabDirective): void {
	    this.value = data.heading;

	    if(data.heading=='Datos semanales'&&this.generalWeeklyChartData.length<1) {
	    	console.log('Hice request al server');
	    	this.loading = true;
		    this.profileService
				.getWeeklyData()
				.then((data: any[]) => {
					
					if (data){
						if(data.length===1){

							//Si hay ejercicios de un tipo
							if(data[0].totalCorrect>0||data[0].totalIncorrect>0){
								//El usuario ha tenido actividad en un tipo de actividad
								if(data[0]._id==='Mistake'){
									this.numberOfWeeklyMistakesActivities = data[0].count;
									this.mistakesWeeklyChartData.push(data[0].totalCorrect);
									this.mistakesWeeklyChartData.push(data[0].totalIncorrect);
								} else {
									this.numberOfWeeklySelectionActivities = data[0].count;
									this.selectionWeeklyChartData.push(data[0].totalCorrect);
									this.selectionWeeklyChartData.push(data[0].totalIncorrect);
								}
								this.generalWeeklyChartData.push(data[0].totalCorrect);
								this.generalWeeklyChartData.push(data[0].totalIncorrect);
								this.numberOfWeeklyActivities = data[0].count;
							}

						} else if(data.length===2) {

							console.log('Entré')

							//Si hay ejercicios de los dos tipos
							if((data[0].totalCorrect>0||data[0].totalIncorrect>0)&&(data[1].totalCorrect>0||data[1].totalIncorrect>0)) {
								//El usuario ha tenido actividad
								data.forEach(function(dataset, index){

									if(dataset._id==='Mistake'){
										this.numberOfWeeklyMistakesActivities = dataset.count;
										this.mistakesWeeklyChartData.push(dataset.totalCorrect);
										this.mistakesWeeklyChartData.push(dataset.totalIncorrect);
									} else {
										this.numberOfWeeklySelectionActivities = dataset.count;
										this.selectionWeeklyChartData.push(dataset.totalCorrect);
										this.selectionWeeklyChartData.push(dataset.totalIncorrect);

									}
								}, this)
								
								this.generalWeeklyChartData.push(data[0].totalCorrect + data[1].totalCorrect);
								this.generalWeeklyChartData.push(data[0].totalIncorrect + data[1].totalIncorrect);
								this.numberOfWeeklyActivities = data[0].count + data[1].count;
							} else {

								//Solo hay ejercicios de un tipo
								if(data[0].totalCorrect>0||data[0].totalIncorrect>0){
									//El usuario ha tenido actividad en un tipo de actividad
									if(data[0]._id==='Mistake'){
										this.numberOfWeeklyMistakesActivities = data[0].count;
									} else {
										this.numberOfWeeklySelectionActivities = data[0].count;
									}
									this.generalWeeklyChartData.push(data[0].totalCorrect);
									this.generalWeeklyChartData.push(data[0].totalIncorrect);
									this.numberOfWeeklyActivities = data[0].count;
								}else {
									//El usuario ha tenido actividad en un tipo de actividad
									if(data[1]._id==='Mistake'){
										this.numberOfWeeklyMistakesActivities = data[1].count;
									} else {
										this.numberOfWeeklySelectionActivities = data[1].count;
									}
									this.generalWeeklyChartData.push(data[1].totalCorrect);
									this.generalWeeklyChartData.push(data[1].totalIncorrect);
									this.numberOfWeeklyActivities = data[1].count;
								}

							}

						}
					}

					this.loading = false;
				})
				.catch((err: any) => {
					this.snackBar.open(`Hubo un problema al traer la información. Intenta más tarde`, 'x', { duration: 2500, verticalPosition: 'top', panelClass: ['snackbar-color'] });
					this.router.navigateByUrl('/');
				});

	    }

	}

	// events
  	public chartClicked(e:any):void {
    	console.log(e);
	}
 
	public chartHovered(e:any):void {
    	console.log(e);
  	}
}