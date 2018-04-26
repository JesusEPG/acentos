//Modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppBootstrapModule } from './app-bootstrap.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { NgPipesModule } from 'ngx-pipes'; //CAMBIAR!!

//Angular Material
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import 'hammerjs';

//Components
import { AppComponent } from './app.component';
import { LandingComponent } from './landing/landing.component';
import { SignupComponent } from './auth/signup.component';
import { SigninComponent } from './auth/signin.component';
import { ProfileComponent } from './profile/profile.component';
import { ActivitiesComponent } from './activities/activities.component';
import { SelectionActivitiesComponent } from './activities/selectionActivities.component';
import { MistakeActivitiesComponent } from './activities/mistakeActivities.component';
import { SimpleSelectionComponent } from './simpleSelection/simpleSelection.component';
import { MistakesComponent } from './mistakes/mistakes.component';
import { AdminDashboardComponent } from './admin/adminDashboard.component';
import { AdminActivitiesComponent } from './admin/adminActivities.component';
import { AdminSigninComponent } from './admin/adminSignin.component';


//Services
import { AuthService } from './auth/auth.service';
import { AuthGuard } from './auth/auth-guard.service';
import { SigninGuard } from './auth/signin-guard.service';
import { AdminGuardService } from './auth/admin-guard.service';
//import { JwtHelperService } from '@auth0/angular-jwt';

//Routes
import { Routing } from './app.routing';


@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    SignupComponent,
    SigninComponent,
    ProfileComponent,
    ActivitiesComponent,
    SelectionActivitiesComponent,
    MistakeActivitiesComponent,
    AdminDashboardComponent,
    AdminActivitiesComponent,
    SimpleSelectionComponent,
    MistakesComponent,
    AdminSigninComponent
  ],
  imports: [
    BrowserModule,
    AppBootstrapModule,
    Routing,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    BrowserAnimationsModule,
    MaterialModule,
    ChartsModule,
    NgPipesModule
  ],
  providers: [AuthService, AuthGuard, SigninGuard, AdminGuardService],
  bootstrap: [AppComponent]
})
export class AppModule { }
