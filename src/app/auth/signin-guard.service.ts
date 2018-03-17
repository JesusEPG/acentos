import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class SigninGuard implements CanActivate {
	
	constructor(
	    private router: Router, 
	    private authService: AuthService) {}

	  canActivate() {
	    if (this.authService.isLoggedIn()) {
	      
	      this.router.navigate(['/']);
	      return false;
	    }
	   
	    return true;
	}
}