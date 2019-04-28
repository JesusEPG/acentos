import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
	
	constructor(
	    private router: Router, 
	    private authService: AuthService) {}

	  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
	    
	    if (this.authService.isTokenExpired()) {
	      	if(this.authService.isAdminLoggedIn()){
	      		//hay bug intentar ir a admin desde user normal
	      		this.router.navigate(['/admin']);
	      		return false;
	      	} else {
	      		this.router.navigate(['/signin'], { queryParams: { returnUrl: state.url }});
	      		return false;
	      	}
	    }
	    return true;
	}
}