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


	// @HostListener allows us to also guard against browser refresh, close, etc.
  	@HostListener('window:beforeunload')
  	canDeactivate(): Observable<boolean> | boolean {
    	// insert logic to check if there are pending changes here;
    	// returning true will navigate without confirmation
    	// returning false will show a confirm dialog before navigating away
    	//return false;
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
			/*fullString: new FormControl(null, [
				Validators.required//,
				Validators.pattern(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)
			]),*/
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
			console.log(tokens);

			//Si 'token' es un signo de puntuación, se coloca 'cliackeable:false'
			//Y en el cliente solo se muestran los que tengan 'clickeable:true'
			this.splittedString = tokens.map(function(token, index) {

				//Verificar si es un caracter especial, no es clickeable.
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

			console.log(this.activityWords)
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
			console.log('entre al else');
			this.correctAnswer = null;
		}
		word.hidden = !word.hidden;
		this.splittedString[word.id].hidden = word.hidden;
		console.log(this.correctAnswer);
		console.log(word);
		console.log(this.splittedString);
		//De lo contrario se debe buscar el objeto en los arreglos y luego sacarlo
	}

	addCorrectAnswer(word){
		//word.clickeable = !word.clickeable;

		this.possibleAnswers.push(word);
		/*const newAnswer = {
			id: word.id,
			word: word.word,
			hidden: false,
			clickeable: false,
			possibleAnswers: [word]
			
		}*/
		this.correctAnswer=word;
	}

	deleteCorrectAnswer(word){
		//word.clickeable = !word.clickeable;
		//Buscar el objeto y luego eliminarlo
		//this.remove(this.correctAnswer, word);
		this.correctAnswer = null;
		//this.remove(this.possibleAnswers, word);
		this.possibleAnswers=[];

	}

	addPossibleAnswer(){
		let str = this.activityForm.value.possibleAnswer;
		this.activityForm.patchValue({possibleAnswer: null});
		console.log(str);
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
		//word.clickeable = !word.clickeable;
		//this.remove(this.possibleAnswers, word);
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
			console.log(comment);
			const difficultyNumber = this.round(parseInt(difficulty, 10) * 0.1, 1);
			//console.log(difficulty)
			const activity = new MistakeActivity(
				difficultyNumber,
				'Mistake',
				comment.trim(),
				fullString,
				this.splittedString,
				this.correctAnswer,
				this.possibleAnswers
			);
			console.log(activity);
			
			this.mistakeService.addMistakeActivity(activity)
				.subscribe(
					//( {_id} ) => this.router.navigate(['/questions', _id]),
					//this.router.navigate(['/']),
					(  ) => {
						this.done = true;
						this.snackBar.open(`Se ha creado la actividad exitosamente`,
											'x',
											{ duration: 2500, verticalPosition: 'top', panelClass: ['snackbar-color']}
						);
						this.router.navigate(['/admin']);
					},
					this.authService.handleError
				);//recibe dos funciones como parametros, la función de exito y la función de error*/
		} else {
			//Not valid
			this.snackBar.open(`Verificar los datos e intentar nuevamente!`,
								'x',
								{ duration: 2500, verticalPosition: 'top', panelClass: ['snackbar-color']}
			);
		}
	}

}