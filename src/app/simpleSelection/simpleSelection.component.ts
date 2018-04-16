import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SimpleSelectionActivity } from './simpleSelection.model';
import { SimpleSelectionService } from './simpleSelection.service';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

@Component({
	selector: 'app-simple-selection-component',
	templateUrl: './simpleSelection.component.html',
	styleUrls: ['simpleSelection.component.css'],
	providers: [SimpleSelectionService]
})

export class SimpleSelectionComponent implements OnInit {
	activityForm: FormGroup;
	splittedString: any[];
	correctAnswer: any;
	possibleAnswers: any[]=[];

	constructor(
		private simpleSelectionService: SimpleSelectionService,
		private router: Router,
		private authService: AuthService){}

	ngOnInit(){
		this.activityForm = new FormGroup({
			comment: new FormControl(null, Validators.required),
			difficulty: new FormControl(null, Validators.required),
			possibleAnswer: new FormControl(null), //Validar que solo acepte
			fullString: new FormControl(null, [Validators.required, Validators.max(200)])
			/*fullString: new FormControl(null, [
				Validators.required//,
				Validators.pattern(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)
			]),*/
		});

	}

	stringTokenizer(){
		
		//Obtengo el texto del formulario
		let str = this.activityForm.value.fullString;

		//Se debe usar una expresión regular para que solo forme las palabras
		//Y guarde los signos de puntuación
		//Se separa en espacios
		let tokens = str.split(/(;\s|:\s|,|,\s|\?\s|\?|\s)/);
		console.log(tokens);

		//Validar que si 'token' es un signo de puntuación, se debe colocar 'cliackeable:false'
		//Y en el cliente solo se muestran los que tengan 'clickeable:true'
		this.splittedString = tokens.map(function(token, index) {

			//Verificar si es un caracter especial, no es clickeable.
			if(/^[a-zA-ZáÁéÉíÍóÓúÚñÑ]+$/.test(token)){
				
				return {
					//id: window.performance && window.performance.now && window.performance.timing && window.performance.timing.navigationStart ? window.performance.now() + window.performance.timing.navigationStart : Date.now(),				
				   	id: index,
				   	word: token,
				   	hidden: false,
				   	clickeable: true
				}
			}
			return {
				//id: window.performance && window.performance.now && window.performance.timing && window.performance.timing.navigationStart ? window.performance.now() + window.performance.timing.navigationStart : Date.now(),
				id: index,
				word: token,
			   	hidden: false,
			   	clickeable: false
			}   
		});
	}

	hideAnswer(word){

		//De ser seleccionada una palabra, es decir word.hidden == false
		//Se hace word.hidden = false y
		//Se debe agregar al arreglo de respuestas correctas y de respuestas posibles
		//Analizar los casos en que se deben ocultar o no estas palabras
		//O si se les puede hacer click

		if(!word.hidden){
			
			this.addCorrectAnswer(word);
			
		} else {
			this.deleteCorrectAnswer(word);
		}
		word.hidden = !word.hidden;
		//De lo contrario se debe buscar el objeto en los arreglos y luego sacarlo
	}

	log(){
		console.log(this.splittedString);
		console.log(this.correctAnswer);
		console.log(this.possibleAnswers);
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
		const word = {
				   	id: this.possibleAnswers.length,
				   	word: str,
				   	hidden: false,
				   	clickeable: true
				};
		this.possibleAnswers.push(word);
	}

	deletePossibleAnswer(word){
		//word.clickeable = !word.clickeable;
		this.remove(this.possibleAnswers, word);
	}

	hasOnlywords(word){}

	remove(array, element) {
	    const index = array.indexOf(element);
    
	    if (index !== -1) {
	        array.splice(index, 1);
	    }
	}

	onSubmit(){
		if(this.activityForm.valid){
			const {difficulty, comment, fullString} = this.activityForm.value;
			const difficultyNumber = parseInt(difficulty, 10) * 0.1;
			console.log(difficulty)
			const activity = new SimpleSelectionActivity(
				difficultyNumber,
				comment,
				fullString,
				this.splittedString,
				this.correctAnswer,
				this.possibleAnswers,
				new Date
			);
			console.log(activity);
			/*this.simpleSelectionService.signin(user)
				.subscribe(
					this.authService.login,
					this.authService.handleError
				);
			*/
			this.simpleSelectionService.addSimpleSelectionActivity(activity)
				.subscribe(
					//( {_id} ) => this.router.navigate(['/questions', _id]),
					//this.router.navigate(['/']),
					( {_id} ) => this.router.navigate(['/']),
					this.authService.handleError
				);//recibe dos funciones como parametros, la función de exito y la función de error
		} else {
			//snackbar con mensaje 'Verificar los datos ingresados e intentar de nuevo'
			console.log('Not valid');
		}
	}

}