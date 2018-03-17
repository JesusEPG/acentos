//Modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppBootstrapModule } from './app-bootstrap.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';


//Components
import { AppComponent } from './app.component';
import { LandingComponent } from './landing/landing.component';
import { SignupComponent } from './auth/signup.component';
import { SigninComponent } from './auth/signin.component';
import { ProfileComponent } from './profile/profile.component';

//Services
import { AuthService } from './auth/auth.service';
import { AuthGuard } from './auth/auth-guard.service';
import { SigninGuard } from './auth/signin-guard.service';
//import { JwtHelperService } from '@auth0/angular-jwt';

//Routes
import { Routing } from './app.routing';


@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    SignupComponent,
    SigninComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    AppBootstrapModule,
    Routing,
    FormsModule,
    ReactiveFormsModule,
    HttpModule
  ],
  providers: [AuthService, AuthGuard, SigninGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
