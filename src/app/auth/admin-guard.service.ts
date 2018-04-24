import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import * as decode from 'jwt-decode';

@Injectable()
export class AdminGuardService implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    // this will be passed from the route config
    // on the data property
    //const expectedRole = route.data.expectedRole;

    /*const expectedRole = 'admin';
    const token = localStorage.getItem('token');

    // decode the token to get its payload
    const tokenPayload = decode(token);*/

    if(this.authService.isAdminLoggedIn())
    {
      return true;
    }
    // not logged in so redirect to login page with the return url and return false
    this.router.navigate(['/admin/signin'], { queryParams: { returnUrl: state.url }});
    return false;

    /*if (
      !this.authService.isLoggedIn() || 
      tokenPayload.role !== expectedRole
    ) {
      this.router.navigate(['signin']);
      return false;
    }
    return true;*/
  }

}