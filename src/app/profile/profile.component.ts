import { Component } from '@angular/core';
import { AuthService } from '../auth/auth.service';


@Component({
	selector: 'app-profile-component',
	templateUrl: './profile.component.html',

})

export class ProfileComponent {

	constructor(private authService: AuthService) {}

	isLoggedIn() {
		return this.authService.isLoggedIn();
	}

	fullName() {
		return this.authService.currentUser.fullName();
	}
}