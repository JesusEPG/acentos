import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
	
	constructor(
	    private router: Router, 
	    private authService: AuthService) {}

	  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
	    /*if (!this.authService.isTokenExpired()) {
	      return true;
	    }*/

	    if (this.authService.isTokenExpired()) {
	      	if(this.authService.isAdminLoggedIn()){
	      		this.router.navigate(['/admin']);
	      		return false;
	      	} else {
	      		this.router.navigate(['/signin'], { queryParams: { returnUrl: state.url }});
	      		return false;
	      	}
	    }

	    //this.router.navigate(['/signin']);

	    // not logged in so redirect to login page with the return url and return false
        //this.router.navigate(['/signin'], { queryParams: { returnUrl: state.url }});
	    return true;
	}
}