import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { AdminUser } from '../auth/adminUser.model';
import { Router, ActivatedRoute } from '@angular/router';
//import { AlertComponent } from 'ngx-bootstrap/alert/alert.component';


@Component({
	selector: 'app-admin-signin-component',
	templateUrl: './adminSignin.component.html',
	styleUrls: ['./adminSignin.component.css']
})

export class AdminSigninComponent implements OnInit {

	signinForm: FormGroup;
	alert?: any;
	returnUrl: string;

	constructor(
		private authService: AuthService,
		private route: ActivatedRoute,
        private router: Router){}

	ngOnInit() {
		this.signinForm = new FormGroup({
			email: new FormControl(null, [
				Validators.required,
				Validators.pattern(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)
			]),//valor por default y array de validaciones
			password: new FormControl(null, Validators.required)
		})

		// get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/admin';
	}

	onSubmit(){
		if(this.signinForm.valid){

			const { email, password} = this.signinForm.value;
			console.log(`Usuario: ${email}, Contraseña: ${password}`);
			this.signinForm.reset();

			const user = new AdminUser (email, password);
			this.authService.adminSignin(user)
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