import { Component, OnInit, OnDestroy } from '@angular/core';
import { SelectionActivity } from './selectionActivity.model';
import { ActivitiesService } from './activities.service';
import { WORST, BEST, CORRECT, INCORRECT, review } from './sm2-plus.module';
import { Router, NavigationEnd } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ComponentCanDeactivate } from './session-guard.service';
import { HostListener } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from "rxjs/Subject";
import "rxjs/add/operator/takeUntil";
import 'rxjs/add/operator/filter';
//import { NavigationStart, NavigationEnd, NavigationError, NavigationCancel, RoutesRecognized } from '@angular/router';


@Component({
	selector: 'app-selection-component',
	templateUrl: './mistakeActivities.component.html',
	styleUrls: ['./mistakeActivities.component.css'],
	providers: [ActivitiesService]
})

export class MistakeActivitiesComponent implements OnInit, OnDestroy, ComponentCanDeactivate {

	//private ngUnsubscribe: Subject = new Subject();
	private unsubscribe = new Subject<void>();
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

		/*router.events
	    .filter(event => event instanceof NavigationEnd)
	    .subscribe((event:NavigationEnd) => {
	      // You only receive NavigationStart events
	      console.log('Te fuiste');
	    });*/

	    /*router.events.subscribe((val) => {
	        // see also 
	        console.log(val instanceof NavigationEnd) 
	    });*/

	}

	 // @HostListener allows us to also guard against browser refresh, close, etc.
  	@HostListener('window:beforeunload')
  	canDeactivate(): Observable<boolean> | boolean {
    	// insert logic to check if there are pending changes here;
    	// returning true will navigate without confirmation
    	// returning false will show a confirm dialog before navigating away

    	if(!this.preview&&!this.result){
			return false;
    	} else {
    		return true;
    	}

  	}


	ngOnInit() {
		
		this.activitiesService
			.getMistakeActivities()
			.then((activities: SelectionActivity[]) => {
				console.log('Then');
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

		console.log('NgOnInit!')

		/*console.log('Prueba bien');
				
		this.activitiesService.prueba(this.activities)
			.takeUntil(this.unsubscribe)
			.subscribe(
				//( {_id} ) => this.router.navigate(['/', _id]),
				() => {console.log('Subscribe')}
			);*/
		//setTimeout(function(){console.log('Luego del timeout');},55000);
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
				.takeUntil(this.unsubscribe)
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

		/*this.activitiesService.prueba(this.activities)
			.takeUntil(this.unsubscribe)
			.subscribe(
					//( {_id} ) => this.router.navigate(['/', _id]),
					() => {}
			);*/
		setTimeout(()=>{    //<<<---    using ()=> syntax
		    this.unsubscribe.next();
	    	this.unsubscribe.complete();
		 }, 1000);

	    //this.unsubscribe.next();
	    //this.unsubscribe.complete();


		/*if(this.activities){
			if(this.activities.length>0){
				this.activitiesService.updateActivities(this.updatedActivities);
			} else {
				console.log('Prueba');
				this.activitiesService.prueba(this.activities);
			}
		} else {
			console.log('Prueba');
			
			this.activitiesService.prueba(this.activities);
		}*/
	}
}
