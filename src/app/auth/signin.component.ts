import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from './auth.service';
import { User } from './user.model';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
	selector: 'app-signin-component',
	templateUrl: './signin.component.html',
	styleUrls: ['./signin.component.css']
})

export class SigninComponent implements OnInit {

	signinForm: FormGroup;
	returnUrl: string;
	loading:boolean = false;

	constructor(
		private authService: AuthService,
		private route: ActivatedRoute,
        private router: Router,
        private snackBar: MatSnackBar){}

	ngOnInit() {
		this.signinForm = new FormGroup({
			userName: new FormControl(null, [Validators.required]),
			password: new FormControl(null, Validators.required)
		})

        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
	}

	onSubmit(){
		if(this.signinForm.valid){
			this.loading = true;
			const { userName, password} = this.signinForm.value;

			const user = new User (userName, password);
			this.authService.signin(user)
				.subscribe(
					() => {
	                    if(this.returnUrl==='/'){
	                    	this.router.navigateByUrl('/profile');
	                    } else {
	                    	this.router.navigateByUrl(this.returnUrl);
	                    } 
	                },
					(error) => {
						//Error en el servidor
						this.snackBar.open(error,
											'x',
											{ duration: 2500, verticalPosition: 'top', panelClass: ['snackbar-color']}
						);
						this.authService.logout();
						this.loading = false;
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