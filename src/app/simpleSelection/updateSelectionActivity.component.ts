import { Component, OnInit, HostListener } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SimpleSelectionActivity } from './simpleSelection.model';
import { SimpleSelectionService } from './simpleSelection.service';
import { AuthService } from '../auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ComponentCanDeactivate } from '../activities/session-guard.service';
import { Observable } from 'rxjs/Observable';

@Component({
	selector: 'app-update-selection-activity-component',
	templateUrl: './updateSelectionActivity.component.html',
	styleUrls: ['./simpleSelection.component.css'],
	providers: [SimpleSelectionService]
})

export class UpdateSelectionActivityComponent implements OnInit, ComponentCanDeactivate {
	activityForm: FormGroup;
	splittedString: any[];
	correctAnswer: any;
	possibleAnswers: any[]=[];
	private activity?: SimpleSelectionActivity;
	loading: boolean = true;
	done: boolean = false;

	constructor(private selectionService: SimpleSelectionService,
				private router: Router,
				private route: ActivatedRoute,
				private authService: AuthService,
				public snackBar: MatSnackBar){}

	// @HostListener allows us to also guard against browser refresh, close, etc.
  	@HostListener('window:beforeunload')
  	canDeactivate(): Observable<boolean> | boolean {
    	// insert logic to check if there are pending changes here;
    	// returning true will navigate without confirmation
    	// returning false will show a confirm dialog before navigating away
    	//return false;
    	if((this.activityForm.value.fullString||this.activityForm.value.difficulty||this.activityForm.value.comment)&&!this.done) {

    		return false;
    	} else {

    		return true;
    	}

  	}

	ngOnInit(){
		this.activityForm = new FormGroup({
			comment: new FormControl(null, [Validators.required, Validators.maxLength(50)]),
			difficulty: new FormControl(null, Validators.required),
			possibleAnswer: new FormControl(null, Validators.pattern(/^\S*$/) ), //Validar que solo acepte
			fullString: new FormControl(null, [Validators.required, Validators.maxLength(50)])
			/*fullString: new FormControl(null, [
				Validators.required//,
				Validators.pattern(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)
			]),*/
		});

		//Hacer que vaya a list si no consigue la actividad

		this.route.params.subscribe( params => 
			this.selectionService
			.getSelectionActivity(params['_id'])
			.then((activity: SimpleSelectionActivity) => {
				//Exitoso
				this.activity = activity;
				if(this.activity) {
					//Resultado encontrado
					this.activityForm.patchValue({
					  difficulty: (Math.round(this.activity.difficulty/0.1)).toString(), 
					  comment: this.activity.comment,
					  fullString: this.activity.fullString
					});
					
					this.splittedString = this.activity.splittedString;
					console.log(this.splittedString)
					this.correctAnswer = this.activity.correctAnswer;
					this.possibleAnswers = this.activity.possibleAnswers;
					this.loading = false;
				} else {
					//No se encontró resultado
					this.snackBar.open(`Problemas al obtener la actividad. Intenta más tarde`,
											'x',
											{ duration: 2500, verticalPosition: 'top', panelClass: ['snackbar-color']}
					);
					this.router.navigateByUrl('/admin');
				}
				
			}, (error) => { 
				//Error en el servidor
				console.log('Función de error en el then');
				this.snackBar.open(error.message,
									'x',
									{ duration: 4500, verticalPosition: 'top', panelClass: ['snackbar-color']}
				);
				this.router.navigateByUrl('/admin');

			})
			.catch((error) => {
				//Error en el then
				this.snackBar.open(`Problemas al obtener la actividad. Intenta más tarde`,
									'x',
									{ duration: 2500, verticalPosition: 'top', panelClass: ['snackbar-color']}
				);
				this.router.navigateByUrl('/admin');
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
		//let tokens = str.split(/(;\s|:\s|,|,\s|\?\s|\?|\s)/);
		let tokens = str.split(/(;|;\s|:|:\s|,|,\s|\?|\?\s|\¿|\¿\s|\s\¿|\s|\.|\.\s|-|-\s|\s-|\!|\!\s|\¡|\¡\s|\s\¡)/);

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

		console.log(word);
		console.log(this.correctAnswer);

		this.possibleAnswers=[];

		if(!word.hidden){
			
			//this.addCorrectAnswer(word);
			if(this.correctAnswer){
				this.correctAnswer.hidden=!this.correctAnswer.hidden;
				this.splittedString[this.correctAnswer.id].hidden = this.correctAnswer.hidden;
				this.correctAnswer = null;
			}
			this.correctAnswer=word;
			
		} else {
			//this.deleteCorrectAnswer(word);
			this.correctAnswer = null;
		}
		word.hidden = !word.hidden;

		console.log(this.correctAnswer);
		//console.log(word);
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
			this.loading = true;
			const {difficulty, comment, fullString} = this.activityForm.value;
			const difficultyNumber = this.round(parseInt(difficulty, 10) * 0.1, 1);
			console.log(difficulty)
			const newActivity = new SimpleSelectionActivity(
				difficultyNumber,
				'Mistake',
				comment.trim(),
				fullString,
				this.splittedString,
				this.correctAnswer,
				this.possibleAnswers,
				null,
				this.activity._id
			);
			console.log(newActivity);
			/*this.mistakeService.signin(user)
				.subscribe(
					this.authService.login,
					this.authService.handleError
				);
			*/
			this.selectionService.updateSelectionActivity(newActivity)
				.subscribe(
					//( {_id} ) => this.router.navigate(['/questions', _id]),
					//this.router.navigate(['/']),
					( {message} ) =>{
						this.done = true;
						this.snackBar.open(message,
											'x',
											{ duration: 2500, verticalPosition: 'top', panelClass: ['snackbar-color']}
						);

						this.router.navigate(['/admin'])
					},
					(error) => {
						console.log('En el component');
						console.log(error);

						//Error en el servidor
						console.log('Función de error en el subscribe');
						this.snackBar.open(error,
											'x',
											{ duration: 2500, verticalPosition: 'top', panelClass: ['snackbar-color']}
						);
						//this.loading = false
						this.router.navigateByUrl('/admin');
					}
				);//recibe dos funciones como parametros, la función de exito y la función de error
		} else {
			//Not valid
			this.snackBar.open(`¡Verifica los datos e intenta nuevamente!`,
								'x',
								{ duration: 2500, verticalPosition: 'top', panelClass: ['snackbar-color']}
			);
		}
	}

}