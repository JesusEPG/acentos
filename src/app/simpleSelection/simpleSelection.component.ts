import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
	selector: 'app-simple-selection-component',
	templateUrl: './simpleSelection.component.html'
})

export class SimpleSelectionComponent implements OnInit {
	activityForm: FormGroup;
	splittedString: any[];
	correctAnswers: any[]=[];
	possibleAnswers: any[]=[];

	//constructor(private authService: AuthService){}

	ngOnInit(){
		this.activityForm = new FormGroup({
			firstName: new FormControl(null, Validators.required),
			lastName: new FormControl(null, Validators.required),
			possibleAnswer: new FormControl(null, Validators.required),
			fullString: new FormControl(null, [
				Validators.required//,
				//Validators.pattern(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)
			]),
			password: new FormControl(null, Validators.required)
		});

	}

	stringTokenizer(){
		//this.activityForm.patchValue({fullString: 'Partial'});
		
		//Obtengo el texto del formulario
		let str = this.activityForm.value.fullString;
		console.log(str);

		//Se debe usar una expresión regular para que solo forme las palabras
		//Y guarde los signos de puntuación
		//Se separa en espacios
		let tokens = str.split(/(;\s|:\s|,|,\s|\?\s|\?|\s)/);
		console.log(tokens);

		//Validar que si 'token' es un signo de puntuación, se debe colocar 'cliackeable:false'
		//Y en el cliente solo se muestran los que tengan 'clickeable:true'
		this.splittedString = tokens.map(function(token, index) {

			//Verificar si es un caracter especial, no es clickeable.
			if(/^[a-zA-ZáÁéÉíÍóÓúÚ]+$/.test(token)){
				
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
		console.log(this.splittedString);
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
		console.log(this.correctAnswers);
		console.log(this.possibleAnswers);
	}

	addCorrectAnswer(word){
		//word.clickeable = !word.clickeable;
		this.correctAnswers.push(word);
		this.possibleAnswers.push(word);
	}

	deleteCorrectAnswer(word){
		//word.clickeable = !word.clickeable;
		//Buscar el objeto y luego eliminarlo
		this.remove(this.correctAnswers, word);
		this.remove(this.possibleAnswers, word);

	}

	addPossibleAnswer(){
		let str = this.activityForm.value.possibleAnswer;
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

	onSubmit(){}
}