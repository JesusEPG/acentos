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
	selectedAnswers: any[] =[];
	counter:number = 0;
	loading = true;
	result = false;
	preview = true;

	constructor(private activitiesService: ActivitiesService,
				public snackBar: MatSnackBar,
				private router: Router){

	}
  	@HostListener('window:beforeunload')
  	canDeactivate(): Observable<boolean> | boolean {

    	if(this.preview){
    		return true;
    	} else if (!this.preview&&!this.result){
    		return false;
    	} else {
    		return true;
    	}

  	}

	ngOnInit() {
		this.activitiesService
			.getSelectionActivities()
			.then((activities: SelectionActivity[]) => {
				this.activities = activities;

				if (this.activities) {		

					if(this.activities.length<1){

						this.snackBar.open(`No hay actividades de completar oración disponbles. Intente más tarde`,
											'x', 
											{ duration: 2500, verticalPosition: 'top', panelClass: ['snackbar-color']}
						);
						this.router.navigateByUrl('/');
						
					} else {

						this.renderSpace(this.activities[0].correctAnswer.word);
						this.loading = false;
						
					}
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
		
		//Si no se ha seleccionado se pushea
		if(word.clickeable){

			//Se verifica si hay una respuesta ya seleccionada
			if(this.selectedAnswers[this.counter]){
				this.selectedAnswers[this.counter].clickeable = !this.selectedAnswers[this.counter].clickeable;
				this.selectedAnswers.pop();
			}

			this.selectedAnswers.push(word);
		} else {

			this.selectedAnswers.pop();
		}

		word.clickeable = !word.clickeable
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
					const newValues = review(activity, CORRECT)
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
					activity.incorrectCount++;
					this.selectedAnswers[index].correct=false;
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
					() => {
						this.result=true;
						this.loading=false;
					}
				);
		}
	}

	ngOnDestroy(){

		if(!this.result){
			
			if(this.activities){
				if(this.activities.length>0){
					this.activitiesService.updateActivities(this.activities)
						.takeUntil(this.unsubscribe)
						.subscribe(
								() => {}
						);
				} 
			} else {
				
				//Aquí se deben actualizar los datos que se pidieron a la base datos
				//Cuando se abandona la sesión antes de obtener la respuesta del servidor

				
				/* 
					this.activitiesService.updateLostActivities(this.activities)
					.takeUntil(this.unsubscribe)
					.subscribe(
						//( {_id} ) => this.router.navigate(['/', _id]),
						() => {}
					);
				*/
			}
		}
		setTimeout(()=>{
		    this.unsubscribe.next();
	    	this.unsubscribe.complete();
		 }, 2000);
	}
	
}
