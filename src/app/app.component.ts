import { Component } from '@angular/core';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  isCollapsed = true;
  constructor(private authService: AuthService){}

	isLoggedIn(){
		return this.authService.isLoggedIn();
	}

	isAdminLoggedIn(){
		return this.authService.isAdminLoggedIn();
	}

	fullName(){
	 	return this.authService.currentUser.fullName();
	}

	fullAdminName(){
	 	return this.authService.currentAdminUser.fullName();
	}

	logout(){
	  	this.authService.logout();
	}

	adminLogout(){
		return this.authService.adminLogout();
	}
}
