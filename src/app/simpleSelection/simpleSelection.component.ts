import { Component, OnInit, HostListener } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SimpleSelectionActivity } from './simpleSelection.model';
import { SimpleSelectionService } from './simpleSelection.service';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ComponentCanDeactivate } from '../activities/session-guard.service';
import { Observable } from 'rxjs/Observable';
import { noWhitespaceValidator } from '../utils/noWhitespaces.validator';

@Component({
	selector: 'app-simple-selection-component',
	templateUrl: './simpleSelection.component.html',
	styleUrls: ['simpleSelection.component.css'],
	providers: [SimpleSelectionService]
})

export class SimpleSelectionComponent implements OnInit, ComponentCanDeactivate {
	activityForm: FormGroup;
	splittedString: any[];
	correctAnswer: any;
	possibleAnswers: any[]=[];
	loading:boolean =  false;
	done: boolean = false;
	preview:boolean = true;

	constructor(private simpleSelectionService: SimpleSelectionService,
				private router: Router,
				private authService: AuthService,
				public snackBar: MatSnackBar){}

  	@HostListener('window:beforeunload')
  	canDeactivate(): Observable<boolean> | boolean {
    	if((this.activityForm.value.fullString||this.activityForm.value.difficulty||this.activityForm.value.comment)&&!this.done&&!this.preview) {

    		return false;
    	} else {

    		return true;
    	}

  	}

	ngOnInit(){
		this.activityForm = new FormGroup({
			comment: new FormControl(null, [Validators.required, Validators.maxLength(100), noWhitespaceValidator]),
			difficulty: new FormControl(null, Validators.required),
			possibleAnswer: new FormControl(null), //Validar que solo acepte
			fullString: new FormControl(null, [Validators.required, Validators.maxLength(100)])
		});

	}

	stringTokenizer(){

		this.correctAnswer=null;
		this.possibleAnswers=[];
		
		//Obtengo el texto del formulario
		let str = this.activityForm.value.fullString;
		str.trim();

		let tokens = str.split(/(;|;\s|:|:\s|,|,\s|\?|\?\s|\¿|\¿\s|\s\¿|\s|\.|\.\s|-|-\s|\s-|\!|\!\s|\¡|\¡\s|\s\¡)/);


		//Validar que si 'token' es un signo de puntuación, se debe colocar 'cliackeable:false'
		//Y en el cliente solo se muestran los que tengan 'clickeable:true'
		this.splittedString = tokens.map(function(token, index) {

			//Verificar si es un caracter especial, no es clickeable.
			if(/^[a-zA-ZáÁéÉíÍóÓúÚñÑ]+$/.test(token)){
				
				return {			
				   	id: index,
				   	word: token,
				   	hidden: false,
				   	clickeable: true
				}
			}
			return {
				id: index,
				word: token,
			   	hidden: false,
			   	clickeable: false
			}   
		});
	}

	hideAnswer(word){

		this.possibleAnswers=[];

		if(!word.hidden){

			if(this.correctAnswer){
				this.correctAnswer.hidden=!this.correctAnswer.hidden;
				this.correctAnswer = null;
			}

			this.possibleAnswers.push(word);
			this.correctAnswer=word;
			
		} else {
			this.deleteCorrectAnswer(word);
		}
		word.hidden = !word.hidden;
	}

	deleteCorrectAnswer(word){
		this.correctAnswer = null;
		this.possibleAnswers=[];

	}

	addPossibleAnswer(){
		let str = this.activityForm.value.possibleAnswer;
		this.activityForm.patchValue({possibleAnswer: null});
		if(str){
			const word = {
					   	id: this.possibleAnswers.length,
					   	word: str,
					   	hidden: false,
					   	clickeable: true
					};
			this.possibleAnswers.push(word);
		}
	}

	deletePossibleAnswer(word){
		this.remove(this.possibleAnswers, word);
	}

	remove(array, element) {
	    const index = array.indexOf(element);
    
	    if (index !== -1) {
	        array.splice(index, 1);
	    }
	}

	round(value, precision) {
	    var multiplier = Math.pow(10, precision || 0);
	    return Math.round(value * multiplier) / multiplier;
	}

	onSubmit(){
		if(this.activityForm.valid){
			this.loading=true;
			const {difficulty, comment, fullString} = this.activityForm.value;
			const difficultyNumber = this.round(parseInt(difficulty, 10) * 0.1, 1);
			console.log(difficulty)
			const activity = new SimpleSelectionActivity(
				difficultyNumber,
				'Selection',
				comment.trim(),
				fullString,
				this.splittedString,
				this.correctAnswer,
				this.possibleAnswers
			);
			this.simpleSelectionService.addSimpleSelectionActivity(activity)
				.subscribe(
					( {_id} ) =>{
						this.done = true;
						this.snackBar.open(`Se ha creado la actividad exitosamente`,
											'x',
											{ duration: 2500, verticalPosition: 'top', panelClass: ['snackbar-color']}
						);

						this.router.navigate(['/admin'])
					},
					this.authService.handleError
				);
		} else {
			this.snackBar.open(`Verificar los datos e intentar nuevamente!`,
								'x',
								{ duration: 2500, verticalPosition: 'top', panelClass: ['snackbar-color']}
			);
		}
	}

}