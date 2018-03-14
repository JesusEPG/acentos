import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from './auth.service';
import { User } from './user.model';
//import { AlertComponent } from 'ngx-bootstrap/alert/alert.component';


@Component({
	selector: 'app-signin-component',
	templateUrl: './signin.component.html'
})

export class SigninComponent implements OnInit {

	signinForm: FormGroup;
	alert?: any;

	constructor(private authService: AuthService){}

	ngOnInit() {
		this.signinForm = new FormGroup({
			userName: new FormControl(null, [
				Validators.required//,
				//Validators.pattern(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)
			]),//valor por default y array de validaciones
			password: new FormControl(null, Validators.required)
		})
	}

	onSubmit(){
		if(this.signinForm.valid){

			const { userName, password} = this.signinForm.value;
			console.log(`Usuario: ${userName}, Contraseña: ${password}`);
			this.signinForm.reset();

			const user = new User (userName, password);
			this.authService.signin(user)
				.subscribe(
					this.authService.login,
					this.authService.handleError
				);	
		}
	}
}