import { Component, OnInit, HostListener } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MistakeActivity } from './mistake.model';
import { MistakeService } from './mistake.service';
import { AuthService } from '../auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { noWhitespaceValidator } from '../utils/noWhitespaces.validator';
import { ComponentCanDeactivate } from '../activities/session-guard.service';
import { Observable } from 'rxjs/Observable';

@Component({
	selector: 'app-update-mistake-activity-component',
	templateUrl: './updateMistakeActivity.component.html',
	styleUrls: ['./mistakes.component.css'],
	providers: [MistakeService]
})

export class UpdateMistakeActivityComponent implements OnInit, ComponentCanDeactivate {
	activityForm: FormGroup;
	splittedString: any[];
	correctAnswer: any;
	possibleAnswers: any[]=[];
	activityWords: any[]=[];
	private activity?: MistakeActivity;
	loading: boolean = true;
	done: boolean = false;

	constructor(private mistakeService: MistakeService,
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
			comment: new FormControl(null, [Validators.required, Validators.maxLength(100), noWhitespaceValidator]),
			difficulty: new FormControl(null, Validators.required),
			possibleAnswer: new FormControl(null), //Validar que solo acepte
			fullString: new FormControl(null, [Validators.required, Validators.maxLength(100)])
		});

		this.route.params.subscribe( params => 
			this.mistakeService
			.getMistakeActivity(params['_id'])
			.then((activity: MistakeActivity) => {
				//Exitoso
				this.activity = activity;
				if(this.activity){
					console.log(this.activity);
					console.log((this.activity.difficulty/0.1).toString());
					console.log((Math.round(this.activity.difficulty/0.1)).toString());
					//console.log(this.activities.length);
					this.activityForm.patchValue({
					  difficulty: (Math.round(this.activity.difficulty/0.1)).toString(), 
					  comment: this.activity.comment,
					  fullString: this.activity.fullString
					});
					
					this.splittedString = this.activity.splittedString;
					this.activity.splittedString.map(function(word){
						console.log(word);
						
						this.activityWords.push(word);
					}, this);
					this.correctAnswer = this.activity.correctAnswer;
					this.possibleAnswers = this.activity.possibleAnswers;
					this.loading = false;
				} else {
					//cuando no consigo
					console.log('Catch del else en el component');
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
									{ duration: 2500, verticalPosition: 'top', panelClass: ['snackbar-color']}
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
		this.activityWords=[];

		//Obtengo el texto del formulario
		let str = this.activityForm.value.fullString;
		str.trim();
		let tokens = str.split(/(;|;\s|:|:\s|,|,\s|\?|\?\s|\¿|\¿\s|\s\¿|\s|\.|\.\s|-|-\s|\s-|\!|\!\s|\¡|\¡\s|\s\¡)/);

		console.log(tokens);

		//Validar que si 'token' es un signo de puntuación, se debe colocar 'cliackeable:false'
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

		this.possibleAnswers=[];

		if(!word.hidden){
			//Si no se presiono la palbra que ya está seleccionada
			if(this.correctAnswer){
				this.correctAnswer.hidden=!this.correctAnswer.hidden;
				this.splittedString[this.correctAnswer.id].hidden = this.correctAnswer.hidden;
				this.correctAnswer = null;
			}
			this.correctAnswer=word;
			
		} else {
			//Si se presiono la palbra que ya está seleccionada
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
			const newActivity = new MistakeActivity(
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
			this.mistakeService.updateMistakeActivity(newActivity)
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
			//snackbar con mensaje 'Verificar los datos ingresados e intentar de nuevo'
			console.log('Not valid');
			this.snackBar.open(`Verificar los datos e intentar nuevamente!`,
								'x',
								{ duration: 2500, verticalPosition: 'top', panelClass:['snackbar-color']}
			);
		}
	}

}