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

  	@HostListener('window:beforeunload')
  	canDeactivate(): Observable<boolean> | boolean {
    	
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
		});


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
		});
	}

	hideAnswer(word){

		this.possibleAnswers=[];

		if(!word.hidden){
			
			if(this.correctAnswer){
				this.correctAnswer.hidden=!this.correctAnswer.hidden;
				this.splittedString[this.correctAnswer.id].hidden = this.correctAnswer.hidden;
				this.correctAnswer = null;
			}
			this.possibleAnswers.push(word);
			this.correctAnswer=word;
			
		} else {
			this.correctAnswer = null;
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

						//Error en el servidor
						this.snackBar.open(error,
											'x',
											{ duration: 2500, verticalPosition: 'top', panelClass: ['snackbar-color']}
						);
						this.router.navigateByUrl('/admin');
					}
				);
		} else {
			//Not valid
			this.snackBar.open(`¡Verifica los datos e intenta nuevamente!`,
								'x',
								{ duration: 2500, verticalPosition: 'top', panelClass: ['snackbar-color']}
			);
		}
	}

}