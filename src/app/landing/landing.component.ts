import { Component } from '@angular/core';
import { AuthService } from '../auth/auth.service';

@Component({
	selector: 'app-landing-component',
	templateUrl: './landing.component.html'
})

export class LandingComponent {
	constructor(private authService: AuthService){}

	isLoggedIn(){
		return this.authService.isLoggedIn();
	}

	fullName(){
	 	return this.authService.currentUser.fullName();
	}

	logout(){
	  	this.authService.logout();
	}
}