import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
	selector: 'app-simple-selection-component',
	templateUrl: './simpleSelection.component.html'
})

export class SimpleSelectionComponent implements OnInit {
	activityForm: FormGroup;
	splittedString: any[];
	correctAnswers: any[];
	possibleAnswers: any[];

	//constructor(private authService: AuthService){}

	ngOnInit(){
		this.activityForm = new FormGroup({
			firstName: new FormControl(null, Validators.required),
			lastName: new FormControl(null, Validators.required),
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
		this.splittedString = tokens.map(function(token) {

			//Verificar si es un caracter especial, no es clickeable.
			if(/^[a-zA-ZáÁéÉíÍóÓúÚ]+$/.test(token)){
				
				//Se debe agregar al arreglo de respuestas correctas y de respuestas posibles
				//Analizar los casos en que se deben ocultar o no estas palabras
				//O si se les puede hacer click
				return {				
				   	word: token,
				   	hidden: false,
				   	clickeable: true
				}
			}
			return {
				word: token,
			   	hidden: false,
			   	clickeable: false
			}   
		});
		console.log(this.splittedString);
	}

	hideAnswer(word){

		word.hidden = !word.hidden;

		/*let newWord = this.splittedString.find( token => token.id === word.id );

		newWord.hidden = !word.hidden;

		var foundIndex = this.splittedString.findIndex(token => token.id == word.id);
		this.splittedString[foundIndex] = newWord;*/

		console.log(this.splittedString);
	}

	log(){
		console.log(this.splittedString);
	}

	hasOnlywords(word){
		return /^[a-zA-Z\-_ ’'‘ÆÐƎƏƐƔĲŊŒẞÞǷȜæðǝəɛɣĳŋœĸſßþƿȝĄƁÇĐƊĘĦĮƘŁØƠŞȘŢȚŦŲƯY̨Ƴąɓçđɗęħįƙłøơşșţțŧųưy̨ƴÁÀÂÄǍĂĀÃÅǺĄÆǼǢƁĆĊĈČÇĎḌĐƊÐÉÈĖÊËĚĔĒĘẸƎƏƐĠĜǦĞĢƔáàâäǎăāãåǻąæǽǣɓćċĉčçďḍđɗðéèėêëěĕēęẹǝəɛġĝǧğģɣĤḤĦIÍÌİÎÏǏĬĪĨĮỊĲĴĶƘĹĻŁĽĿʼNŃN̈ŇÑŅŊÓÒÔÖǑŎŌÕŐỌØǾƠŒĥḥħıíìiîïǐĭīĩįịĳĵķƙĸĺļłľŀŉńn̈ňñņŋóòôöǒŏōõőọøǿơœŔŘŖŚŜŠŞȘṢẞŤŢṬŦÞÚÙÛÜǓŬŪŨŰŮŲỤƯẂẀŴẄǷÝỲŶŸȲỸƳŹŻŽẒŕřŗſśŝšşșṣßťţṭŧþúùûüǔŭūũűůųụưẃẁŵẅƿýỳŷÿȳỹƴźżžẓ]$/.test(word);
	}

	onSubmit(){}
}