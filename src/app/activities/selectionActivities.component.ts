import { Component, OnInit } from '@angular/core';
import { SelectionActivity } from './selectionActivity.model';
import { ActivitiesService } from './activities.service';
import { WORST, BEST, CORRECT, INCORRECT, review } from './sm2-plus.module';

@Component({
	selector: 'app-selection-component',
	templateUrl: 'selectionActivities.component.html',
	providers: [ActivitiesService]
})

export class SelectionActivitiesComponent implements OnInit {

	activities: SelectionActivity[];
	updatedActivities: SelectionActivity[];
	//Verificar si selectedAnswers será object o String
	//En el html, si selectedAnswers[counter] está vació
	//Se muestra la oración con una ralla en donde toque la respuesta correcta
	//De no estar vacío se muestra lo que se haya seleccionado
	selectedAnswers: any[] =[];
	counter:number = 0;
	loading = true;
	result = false;

	constructor(private activitiesService: ActivitiesService){

	}

	ngOnInit() {
		console.log(WORST)
		console.log(BEST)
		console.log(CORRECT)
		//console.log(calculate)
		this.activitiesService
			.getSelectionActivities()
			.then((activities: SelectionActivity[]) => {
				this.activities = activities;
				console.log(this.activities);
				console.log(this.activities.length);
				this.loading = false;
			});
	}

	selectAnswer(word){
		
		//Debo recibir la respuesta, puede ser el string
		//Si no se ha seleccionado se pushea
		//Hago un push de la respuesta a selectedAnswers
		if(word.clickeable){
			//push
			if(this.selectedAnswers[this.counter]){
				this.selectedAnswers[this.counter].clickeable = !this.selectedAnswers[this.counter].clickeable;
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

		word.clickeable = !word.clickeable

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
					activity.correctCount++;
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
					console.log('Incorrecto');
					activity.incorrectCount++;
					//const newValues = calculate(activity, WORST, Math.round(new Date().getTime() / DAY_IN_MINISECONDS))
					//console.log(newValues);
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
