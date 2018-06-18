import { Component, OnInit, OnDestroy } from '@angular/core';
import { SelectionActivity } from './selectionActivity.model';
import { ActivitiesService } from './activities.service';
import { WORST, BEST, CORRECT, INCORRECT, review } from './sm2-plus.module';
import { Router} from '@angular/router';
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
				this.activities = activities;
				if(this.activities.length<1){

					this.snackBar.open(`No hay actividades de identificación de error disponibles. Intente más tarde`,
										'x', 
										{ duration: 2500, verticalPosition: 'top', panelClass: ['snackbar-color']}
					);
					this.router.navigateByUrl('/');
					
				} else {

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
	}
	
	next() {
		if (this.counter < this.activities.length-1) {
			this.counter++;
		} else {
			this.loading = true;

			this.updatedActivities = this.activities.map(function(activity, index){
				if(this.selectedAnswers[index].word === activity.correctAnswer.word){
					//respuesta correcta
					activity.correctCount++;

					this.selectedAnswers[index].correct=true;

					//calcular cambios del algoritmo
					const newValues = review(activity, CORRECT)

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
				} else {
					//respuesta erronea
					this.selectedAnswers[index].correct=false;
					activity.incorrectCount++;


					const newValues = review(activity, INCORRECT)
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
				}
			},this)
			
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
				);
		}
	}
	
	ngOnDestroy(){

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
		setTimeout(()=>{
		    this.unsubscribe.next();
	    	this.unsubscribe.complete();
		 }, 1000);
	}
}
