import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from './auth.service';
import { User } from './user.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
	selector: 'app-signup-component',
	templateUrl: './signup.component.html',
	styleUrls: ['./signup.component.css']
})

export class SignupComponent implements OnInit {

	signupForm: FormGroup;
	loading:boolean = false;

	constructor(private authService: AuthService,
				private snackBar: MatSnackBar){}

	ngOnInit(){
		this.signupForm = new FormGroup({
			firstName: new FormControl(null, Validators.required),
			lastName: new FormControl(null, Validators.required),
			userName: new FormControl(null, [
				Validators.required//,
				//Validators.pattern(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)
			]),
			school: new FormControl(null, Validators.required),
			grade: new FormControl(null, [Validators.required]),
			password: new FormControl(null, Validators.required)
		});

	}

	onSubmit() {
		if(this.signupForm.valid){
			this.loading = true;
			const {firstName, lastName, userName, password, school, grade} = this.signupForm.value;
			const user = new User(userName, password, firstName, lastName, school, grade);
			this.authService.signup(user)
				.subscribe(
					this.authService.login,
					//err => console.log(err)
					//this.authService.handleError
					(error) => {
						//Error en el servidor
						console.log('Función de error en el then');
						console.log(error);
						if(error==="Registro de usuario falló. Nombre de usuario ya está en uso"){
							this.snackBar.open(error,
												'x',
												{ duration: 2500, verticalPosition: 'top', panelClass: ['snackbar-color']}
							);
							this.loading = false;
							//this.signupForm.reset();
						} else {
							this.snackBar.open(error,
												'x',
												{ duration: 2500, verticalPosition: 'top', panelClass: ['snackbar-color']}
							);
							//this.router.navigateByUrl('/admin');
							this.authService.adminLogout();
						}
					}
				);
			this.signupForm.reset();
		} else {
			//Not valid
			this.snackBar.open(`Verifica los datos e intenta nuevamente!`,
								'x',
								{ duration: 2500, verticalPosition: 'top', panelClass: ['snackbar-color']}
			);
		}
	}
}