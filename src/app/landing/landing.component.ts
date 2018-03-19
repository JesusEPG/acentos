import { Component } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { CarouselConfig } from 'ngx-bootstrap/carousel';

@Component({
	selector: 'app-landing-component',
	templateUrl: './landing.component.html',
	styleUrls: ['./landing.component.css'],
	providers: [
		{ provide: CarouselConfig, useValue: { interval: 3000, noPause: true, showIndicators: true } }
	]
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