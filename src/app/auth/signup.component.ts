import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
	selector: 'app-signup-component',
	templateUrl: './signup.component.html'
})

export class SignupComponent implements OnInit {

	signupForm: FormGroup;

	constructor(){}

	ngOnInit(){
		this.signupForm = new FormGroup({
			firstName: new FormControl(null, Validators.required),
			lastName: new FormControl(null, Validators.required),
			userName: new FormControl(null, [
				Validators.required//,
				//Validators.pattern(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)
			]),
			password: new FormControl(null, Validators.required)
		});

	}

	onSubmit() {
		if(this.signupForm.valid){
			const {firstName, lastName, userName, password} = this.signupForm.value;
			//const user = new User(email, password, firstName, lastName);
			console.log(`Nombre Completo: ${firstName} ${lastName}, Username: ${userName}, Contraseña: ${password}`);
			/*this.authService.signup(user)
				.subscribe(
					this.authService.login,
					err => console.log(err)
				);*/
			this.signupForm.reset();
		}
	}
}