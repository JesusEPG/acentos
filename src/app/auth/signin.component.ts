import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from './auth.service';
import { User } from './user.model';
import { Router, ActivatedRoute } from '@angular/router';
//import { AlertComponent } from 'ngx-bootstrap/alert/alert.component';


@Component({
	selector: 'app-signin-component',
	templateUrl: './signin.component.html',
	styleUrls: ['./signin.component.css']
})

export class SigninComponent implements OnInit {

	signinForm: FormGroup;
	alert?: any;
	returnUrl: string;
	loading:boolean = false;

	constructor(
		private authService: AuthService,
		private route: ActivatedRoute,
        private router: Router){}

	ngOnInit() {
		this.signinForm = new FormGroup({
			userName: new FormControl(null, [
				Validators.required//,
				//Validators.pattern(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)
			]),//valor por default y array de validaciones
			password: new FormControl(null, Validators.required)
		})

		// get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        console.log(this.returnUrl);
	}

	onSubmit(){
		if(this.signinForm.valid){
			this.loading = true;
			const { userName, password} = this.signinForm.value;
			console.log(`Usuario: ${userName}, Contraseña: ${password}`);
			this.signinForm.reset();

			const user = new User (userName, password);
			this.authService.signin(user)
				.subscribe(
					//this.router.navigateByUrl(this.returnUrl),
					//this.authService.login,
					data => {
	                    // login successful so redirect to return url
	                    //this.authService.login;
	                    this.router.navigateByUrl(this.returnUrl);
	                },
					this.authService.handleError
				);	
		}
	}
}