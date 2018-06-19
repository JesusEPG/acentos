import { Component, OnInit, HostListener } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MistakeActivity } from './mistake.model';
import { MistakeService } from './mistake.service';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { noWhitespaceValidator } from '../utils/noWhitespaces.validator';
import { ComponentCanDeactivate } from '../activities/session-guard.service';
import { Observable } from 'rxjs/Observable';

@Component({
	selector: 'app-mistakes-component',
	templateUrl: './mistakes.component.html',
	styleUrls: ['./mistakes.component.css'],
	providers: [MistakeService]
})

export class MistakesComponent implements OnInit, ComponentCanDeactivate {
	activityForm: FormGroup;
	splittedString: any[];
	correctAnswer: any;
	possibleAnswers: any[]=[];
	activityWords: any[]=[];
	loading:boolean =  false;
	done: boolean = false;
	preview:boolean = true;

	constructor(private mistakeService: MistakeService,
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
		this.activityWords=[];


		//Obtengo el texto del formulario
		let str = this.activityForm.value.fullString;
		if(str){

			str.trim();
			let tokens = str.split(/(;|;\s|:|:\s|,|,\s|\?|\?\s|\¿|\¿\s|\s\¿|\s|\.|\.\s|-|-\s|\s-|\!|\!\s|\¡|\¡\s|\s\¡)/);
			

			//Si 'token' es un signo de puntuación, se coloca 'cliackeable:false'
			//Y en el cliente solo se muestran los que tengan 'clickeable:true'
			this.splittedString = tokens.map(function(token, index) {

				//Si es un caracter especial, no es clickeable.
				if(/^[a-zA-ZáÁéÉíÍóÓúÚñÑ]+$/.test(token)){
					this.activityWords.push({			
					   	id: index,
					   	word: token,
					   	hidden: false,
					   	clickeable: true,
					   	selected: false
					});

					return {			
					   	id: index,
					   	word: token,
					   	hidden: false,
					   	clickeable: true,
					   	selected: false
					}
				}
				return {
					id: index,
					word: token,
				   	hidden: false,
				   	clickeable: false,
				   	selected: false
				}   
			}, this);
		}
		
	}

	hideAnswer(word){

		this.possibleAnswers=[];

		if(!word.hidden){
			//Si la palabra no se había seleccionado
			if(this.correctAnswer){
				this.correctAnswer.hidden=!this.correctAnswer.hidden;
				this.splittedString[this.correctAnswer.id].hidden = this.correctAnswer.hidden;
				this.correctAnswer = null;
			}	
			//this.addCorrectAnswer(word);
			this.correctAnswer=word;
			
		} else {
			//this.deleteCorrectAnswer(word);
			this.correctAnswer = null;
		}
		word.hidden = !word.hidden;
		this.splittedString[word.id].hidden = word.hidden;
	}

	addCorrectAnswer(word){

		this.possibleAnswers.push(word);
		this.correctAnswer=word;
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
					   	clickeable: true,
					   	selected: false
					};
			this.possibleAnswers.push(word);
		}
	}

	deletePossibleAnswer(){
		this.possibleAnswers.pop();
	}

	hasOnlywords(word){}

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
			
			const activity = new MistakeActivity(
				difficultyNumber,
				'Mistake',
				comment.trim(),
				fullString,
				this.splittedString,
				this.correctAnswer,
				this.possibleAnswers
			);
			
			this.mistakeService.addMistakeActivity(activity)
				.subscribe(
					(  ) => {
						this.done = true;
						this.snackBar.open(`Se ha creado la actividad exitosamente`,
											'x',
											{ duration: 2500, verticalPosition: 'top', panelClass: ['snackbar-color']}
						);
						this.router.navigate(['/admin']);
					},
					this.authService.handleError
				);
		} else {
			//Not valid
			this.snackBar.open(`Verificar los datos e intentar nuevamente!`,
								'x',
								{ duration: 2500, verticalPosition: 'top', panelClass: ['snackbar-color']}
			);
		}
	}

}