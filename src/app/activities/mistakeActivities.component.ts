import { Component, OnInit } from '@angular/core';
import { SelectionActivity } from './selectionActivity.model';
import { ActivitiesService } from './activities.service';
import { WORST, BEST, CORRECT, INCORRECT, review } from './sm2-plus.module';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
	selector: 'app-selection-component',
	templateUrl: './mistakeActivities.component.html',
	styleUrls: ['./mistakeActivities.component.css'],
	providers: [ActivitiesService]
})

export class MistakeActivitiesComponent implements OnInit {

	activities: SelectionActivity[];
	updatedActivities: SelectionActivity[];
	selectedAnswers: any[] =[];
	counter:number = 0;
	loading = true;
	result = false;
	preview = true;

	constructor(private activitiesService: ActivitiesService,
				public snackBar: MatSnackBar,
				private router: Router){

	}

	ngOnInit() {
		
		this.activitiesService
			.getMistakeActivities()
			.then((activities: SelectionActivity[]) => {

				this.activities = activities;
				if(this.activities.length<1){

					this.snackBar.open(`No hay actividades de selección disponibles. Intente más tarde`,
										'x', 
										{ duration: 2500, verticalPosition: 'top', panelClass: ['snackbar-color']}
					);
					this.router.navigateByUrl('/');
					
				} else {

					console.log(this.activities);
					console.log(this.activities.length);
					this.loading = false;
					
				}
			})
			.catch((err: any) => {
				console.log('Entre al error')
				console.log('Error ' + err);
				//this.loading = false;
			});
	}

	selectAnswer(word){
		
		//Debo recibir la respuesta, puede ser el string
		//Si no se ha seleccionado se pushea
		//Hago un push de la respuesta a selectedAnswers
		if(!word.selected){
			//push
			if(this.selectedAnswers[this.counter]){
				this.selectedAnswers[this.counter].selected = !this.selectedAnswers[this.counter].selected;
				this.selectedAnswers.pop();
			}

			this.selectedAnswers.push(word);
			console.log(this.selectedAnswers);
		} else {
			//pop
			this.selectedAnswers.pop();
			console.log(this.selectedAnswers);


			//this.selectedAnswers.splice(this.counter, 1);
		}

		word.selected = !word.selected

		//Si ya se había seleccionado
		//Se elimina el elemento en la posición this.counter

		//Traer la función desde simpleSelection.component
	}
	
	next() {
		//validar con this.activities.length en vez de 9, asi siempre funciona en base a lo que se traiga
		if (this.counter < this.activities.length-1) {
			// code...
			this.counter++;
		} else {
			this.loading = true;

			this.updatedActivities = this.activities.map(function(activity, index){
				if(this.selectedAnswers[index].word === activity.correctAnswer.word){
					//respuesta correcta
					console.log('Correcto');
					console.log(activity);
					activity.correctCount++;
					console.log(activity);


					this.selectedAnswers[index].correct=true;

					//calcular cambios del algoritmo
					const newValues = review(activity, CORRECT)
					console.log(newValues);

					//new values
					return new SelectionActivity(
						activity.activity,
						newValues.difficulty,
						newValues.lastAttempt,
						newValues.reviewInterval,
						newValues.percentOverDue,
						activity.correctCount,
						activity.incorrectCount,
						true,
						activity._id
					);
			/*		return {
						activity: activity.activity ,
						difficulty: ,
						percentOverDue: , 
						reviewInterval: ,
						lastAttempt:
					}*/
				} else {
					//respuesta erronea
					//const newValues = calculate(activity, WORST, Math.round(new Date().getTime() / DAY_IN_MINISECONDS))
					//console.log(newValues);
					this.selectedAnswers[index].correct=false;
					activity.incorrectCount++;


					const newValues = review(activity, INCORRECT)
					console.log(newValues);
					//new values
					return new SelectionActivity(
						activity.activity,
						newValues.difficulty,
						newValues.lastAttempt,
						newValues.reviewInterval,
						newValues.percentOverDue,
						activity.correctCount,
						activity.incorrectCount,
						false,
						activity._id
					);
					/*return {
						activity: activity.activity ,
						difficulty: ,
						percentOverDue: , 
						reviewInterval: ,
						lastAttempt:
					}*/
				}
			},this)
			//Hacer el post para actualizar las actividades enviando updatedAnswers

			//const q = new Question(form.value.title, form.value.description, new Date(), form.value.icon);
			this.activitiesService.updateActivities(this.updatedActivities)
				.subscribe(
					//( {_id} ) => this.router.navigate(['/', _id]),
					() => {
						this.result=true;
						this.loading=false;
						console.log(this.selectedAnswers);
					},
					this.activitiesService.handleError
				);//recibe dos funciones como parametros, la función de exito y la función de error
			//Cuando responda la bdd hacer loading = false
			//En el cliente hacer un *ngIf="!loading && selectedAnswers.length === 9"
			//this.counter = 0;
		}
	}
	
}
