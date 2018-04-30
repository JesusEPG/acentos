import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MistakeActivity } from './mistake.model';
import { MistakeService } from './mistake.service';
import { AuthService } from '../auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
	selector: 'app-update-mistake-activity-component',
	templateUrl: './updateMistakeActivity.component.html',
	styleUrls: ['./mistakes.component.css'],
	providers: [MistakeService]
})

export class UpdateMistakeActivityComponent implements OnInit {
	activityForm: FormGroup;
	splittedString: any[];
	correctAnswer: any;
	possibleAnswers: any[]=[];
	private activity?: MistakeActivity;
	loading: boolean = true;

	constructor(
		private mistakeService: MistakeService,
		private router: Router,
		private route: ActivatedRoute,
		private authService: AuthService){}

	ngOnInit(){
		this.activityForm = new FormGroup({
			comment: new FormControl(null, [Validators.required, Validators.maxLength(50)]),
			difficulty: new FormControl(null, Validators.required),
			possibleAnswer: new FormControl(null), //Validar que solo acepte
			fullString: new FormControl(null, [Validators.required, Validators.maxLength(50)])
			/*fullString: new FormControl(null, [
				Validators.required//,
				Validators.pattern(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)
			]),*/
		});

		//Hacer que vaya a list si no consigue la actividad

		this.route.params.subscribe( params => 
			this.mistakeService
			.getMistakeActivity(params['_id'])
			.then((activity: MistakeActivity) => {
				this.activity = activity;
				console.log(this.activity);
				console.log((this.activity.difficulty/0.1).toString());
				//console.log(this.activities.length);
				this.activityForm.patchValue({
				  difficulty: (this.activity.difficulty/0.1).toString(), 
				  comment: this.activity.comment,
				  fullString: this.activity.fullString
				});
				
				this.splittedString = this.activity.splittedString;
				this.correctAnswer = this.activity.correctAnswer;
				this.possibleAnswers = this.activity.possibleAnswers;
				this.loading = false;
			}))
	}

	stringTokenizer(){
		
		this.correctAnswer=null;
		this.possibleAnswers=[];


		//Obtengo el texto del formulario
		let str = this.activityForm.value.fullString;
		str.trim();

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
				   	clickeable: true,
				   	selected: false
				}
			}
			return {
				//id: window.performance && window.performance.now && window.performance.timing && window.performance.timing.navigationStart ? window.performance.now() + window.performance.timing.navigationStart : Date.now(),
				id: index,
				word: token,
			   	hidden: false,
			   	clickeable: false,
			   	selected: false
			}   
		});
	}

	hideAnswer(word){

		//De ser seleccionada una palabra, es decir word.hidden == false
		//Se hace word.hidden = false y
		//Se debe agregar al arreglo de respuestas correctas y de respuestas posibles
		//Analizar los casos en que se deben ocultar o no estas palabras
		//O si se les puede hacer click
		console.log(this.possibleAnswers.length)
				console.log(this.possibleAnswers)

		this.possibleAnswers=[];

		if(!word.hidden){
			
			//this.addCorrectAnswer(word);
			this.correctAnswer=word;
			
		} else {
			//this.deleteCorrectAnswer(word);
			this.correctAnswer = null;
		}
		word.hidden = !word.hidden;
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
		console.log(this.possibleAnswers.length)

		const word = {
				   	id: this.possibleAnswers.length,
				   	word: str,
				   	hidden: false,
				   	clickeable: true,
				   	selected: false
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

	round(value, precision) {
	    var multiplier = Math.pow(10, precision || 0);
	    return Math.round(value * multiplier) / multiplier;
	}

	onSubmit(){
		if(this.activityForm.valid){
			const {difficulty, comment, fullString} = this.activityForm.value;
			const difficultyNumber = this.round(parseInt(difficulty, 10) * 0.1, 1);
			console.log(difficulty)
			const newActivity = new MistakeActivity(
				difficultyNumber,
				'Mistake',
				comment.trim(),
				fullString,
				this.splittedString,
				this.correctAnswer,
				this.possibleAnswers,
				new Date,
				this.activity._id
			);
			console.log(newActivity);
			/*this.mistakeService.signin(user)
				.subscribe(
					this.authService.login,
					this.authService.handleError
				);
			*/
			this.mistakeService.updateMistakeActivity(newActivity)
				.subscribe(
					//( {_id} ) => this.router.navigate(['/questions', _id]),
					//this.router.navigate(['/']),
					( {_id} ) => this.router.navigate(['/admin']),
					this.authService.handleError
				);//recibe dos funciones como parametros, la función de exito y la función de error
		} else {
			//snackbar con mensaje 'Verificar los datos ingresados e intentar de nuevo'
			console.log('Not valid');
		}
	}

}