import { Component } from '@angular/core';
import { SelectionActivity } from './selectionActivity.model';
import { ActivitiesService } from './activities.service';
import { WORST, BEST, CORRECT, DAY_IN_MINISECONDS, calculate } from './sm2-plus.module';

@Component({
	selector: 'app-selection-component',
	templateUrl: 'selectionActivities.component.html',
	providers: [ActivitiesService]
})

export class SelectionActivitiesComponent {

	activities: SelectionActivity[];
	//Verificar si selectedAnswers será object o String
	selectedAnswers: any[] =[];
	counter:number = 0;
	loading = true;

	constructor(private activitiesService: ActivitiesService){

	}

	ngOnInit() {
		console.log(WORST)
		console.log(BEST)
		console.log(CORRECT)
		console.log(calculate)
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

			let updatedActivities = this.activities.map(function(activity, index){
				if(this.selectedAnswers[index].word === activity.correctAnswer.word){
					//respuesta correcta
					console.log('Correcto');
					//calcular cambios del algoritmo
					const newValues = calculate(activity, CORRECT, Math.round(new Date().getTime() / DAY_IN_MINISECONDS))
					console.log(newValues);
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
					const newValues = calculate(activity, WORST, Math.round(new Date().getTime() / DAY_IN_MINISECONDS))
					console.log(newValues);
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
			//Cuando responda la bdd hacer loading = false
			//En el cliente hacer un *ngIf="!loading && selectedAnswers.length === 9"
			//this.counter = 0;
		}
	}
	
}
