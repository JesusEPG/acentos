import { Component, OnInit, OnDestroy } from '@angular/core';
import { SelectionActivity } from './selectionActivity.model';
import { ActivitiesService } from './activities.service';
import { WORST, BEST, CORRECT, INCORRECT, review } from './sm2-plus.module';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ComponentCanDeactivate } from './session-guard.service';
import { HostListener } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from "rxjs/Subject";
import "rxjs/add/operator/takeUntil";
import 'rxjs/add/operator/filter';

@Component({
	selector: 'app-selection-component',
	templateUrl: './selectionActivities.component.html',
	styleUrls: ['./selectionActivities.component.css'],
	providers: [ActivitiesService]
})

export class SelectionActivitiesComponent implements OnInit, ComponentCanDeactivate {

	private unsubscribe = new Subject<void>();
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
	preview = true;

	constructor(private activitiesService: ActivitiesService,
				public snackBar: MatSnackBar,
				private router: Router){

	}

	// @HostListener allows us to also guard against browser refresh, close, etc.
  	@HostListener('window:beforeunload')
  	canDeactivate(): Observable<boolean> | boolean {
    	// insert logic to check if there are pending changes here;
    	// returning true will navigate without confirmation
    	// returning false will show a confirm dialog before navigating away

    	if(this.preview){
    		return true;
    	} else if (!this.preview&&!this.result){
    		return false;
    	} else {
    		return true;
    	}

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
				if(this.activities.length<1){

					this.snackBar.open(`No hay actividades de selección disponbles. Intente más tarde`,
										'x', 
										{ duration: 2500, verticalPosition: 'top', panelClass: ['snackbar-color']}
					);
					this.router.navigateByUrl('/');
					
				} else {

					this.renderSpace(this.activities[0].correctAnswer.word);
					this.loading = false;
					
				}
			})
			.catch((err: any) => {
				this.snackBar.open(`Hubo un problema al traer la información. Intenta más tarde`,
									'x',
									{ duration: 2500, verticalPosition: 'top', panelClass: ['snackbar-color'] });
				this.router.navigateByUrl('/');
			});
	}

	renderSpace(word){
		let space ="";
		for (var i = 0; i < word.length; i++) {
			space+="_";
		}

		return space;

	}

	selectAnswer(word){
		
		//Debo recibir la respuesta, puede ser el string
		//Si no se ha seleccionado se pushea
		//Hago un push de la respuesta a selectedAnswers
		if(word.clickeable){
			//push

			//Se verifica si hay una respuesta ya seleccionada
			if(this.selectedAnswers[this.counter]){
				this.selectedAnswers[this.counter].clickeable = !this.selectedAnswers[this.counter].clickeable;
				this.selectedAnswers.pop();
			}

			this.selectedAnswers.push(word);
			console.log(this.selectedAnswers);
		} else {
			//pop
			//le quito la clase agregada
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
					console.log('Incorrecto');
					activity.incorrectCount++;
					this.selectedAnswers[index].correct=false;
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
				.takeUntil(this.unsubscribe)
				.subscribe(
					//( {_id} ) => this.router.navigate(['/', _id]),
					() => {
						this.result=true;
						this.loading=false;
						console.log(this.selectedAnswers);
					},
					//this.activitiesService.handleError
					() => {
						console.log("Error")
						/*
						this.snackBar.open(`Presentamos problema con el servidor. Intenta más tarde`,
											'x',
											{ duration: 2500, verticalPosition: 'top', panelClass: ['snackbar-color']});
						this.router.navigateByUrl('/');
						*/
					}
				);//recibe dos funciones como parametros, la función de exito y la función de error
			//Cuando responda la bdd hacer loading = false
			//En el cliente hacer un *ngIf="!loading && selectedAnswers.length === 9"
			//this.counter = 0;
		}
	}

	ngOnDestroy(){

		console.log('NgOnDestroy!')

		if(!this.result){
			
			console.log('Me fui demasiado');
			if(this.activities){
				if(this.activities.length>0){
					console.log('Mejor Caso');
					this.activitiesService.updateActivities(this.activities)
						.takeUntil(this.unsubscribe)
						.subscribe(
								//( {_id} ) => this.router.navigate(['/', _id]),
								() => {}
						);
				} 
			} else {
				console.log('Prueba bien');
				
				this.activitiesService.prueba(this.activities)
					.takeUntil(this.unsubscribe)
					.subscribe(
						//( {_id} ) => this.router.navigate(['/', _id]),
						() => {}
					);
			}
		}
		setTimeout(()=>{    //<<<---    using ()=> syntax
		    this.unsubscribe.next();
	    	this.unsubscribe.complete();
		 }, 1000);
	}
	
}
