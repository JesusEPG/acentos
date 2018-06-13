import { Component, OnInit, HostListener } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { User } from '../auth/user.model';
import { Router, ActivatedRoute } from '@angular/router';
import { AdminService } from './admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ComponentCanDeactivate } from '../activities/session-guard.service';
import { Observable } from 'rxjs/Observable';

@Component({
	selector: 'app-update-user-component',
	templateUrl: './updateUser.component.html',
	styleUrls: ['./updateUser.component.css'],
	providers: [AdminService]
})

export class UpdateUserComponent implements OnInit, ComponentCanDeactivate {

	userUpdateForm: FormGroup;
	private user?: User;
	loading: boolean = true;
	done: boolean = false;

	constructor(private adminService: AdminService,
				private router: Router,
				private route: ActivatedRoute,
				public snackBar: MatSnackBar){}

	// @HostListener allows us to also guard against browser refresh, close, etc.
  	@HostListener('window:beforeunload')
  	canDeactivate(): Observable<boolean> | boolean {
    	// insert logic to check if there are pending changes here;
    	// returning true will navigate without confirmation
    	// returning false will show a confirm dialog before navigating away
    	//return false;
    	if((this.userUpdateForm.value.firstName||this.userUpdateForm.value.lastName||this.userUpdateForm.value.userName)&&!this.done) {

    		return false;
    	} else {

    		return true;
    	}

  	}

	ngOnInit(){
		this.userUpdateForm = new FormGroup({
			firstName: new FormControl(null, Validators.required),
			lastName: new FormControl(null, Validators.required),
			userName: new FormControl(null, [
			Validators.required//,
				//Validators.pattern(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)
			]),
			school: new FormControl(null, Validators.required),
			grade: new FormControl(null, [Validators.required]),
			password: new FormControl(null)
		});

		this.route.params.subscribe( params => 
			this.adminService
			.getUser(params['_id'])
			.then((user: User) => {
				this.user = user;
				if(this.user) { 
					this.userUpdateForm.patchValue({
					  firstName: this.user.firstName,
					  lastName: this.user.lastName,
					  userName: this.user.userName,
					  school: this.user.school,
					  grade: this.user.grade
					});
					this.loading = false;
				} else {
					//Cuando no se consigue
					this.snackBar.open(`Problemas al obtener la actividad. Intenta más tarde`,
											'x',
											{ duration: 2500, verticalPosition: 'top', panelClass: ['snackbar-color']}
					);
					this.router.navigateByUrl('/admin');

				}
				
			}, (error) => {
				//Error en el servidor
				this.snackBar.open(error.message,
									'x',
									{ duration: 2500, verticalPosition: 'top', panelClass: ['snackbar-color']}
				);
				this.router.navigateByUrl('/admin');
			})
			.catch((error) => {
				//Error en el then
				this.snackBar.open(`Problemas al obtener la actividad. Intenta más tarde`,
									'x',
									{ duration: 2500, verticalPosition: 'top', panelClass: ['snackbar-color']}
				);
				this.router.navigateByUrl('/admin');
			}))

	}

	onSubmit() {
		if(this.userUpdateForm.valid){
			this.loading = true;
			const {firstName, lastName, userName, password, school, grade} = this.userUpdateForm.value;
			console.log("PASSWORD");
			console.log(password);
			const username = userName === this.user.userName? null : userName;
			const user = new User(username, password, firstName, lastName, school, grade, this.user._id);
			console.log(user);
			console.log(`Nombre Completo: ${firstName} ${lastName}, Username: ${userName}, Contraseña: ${password}`);
			this.adminService.updateUser(user)
				.subscribe(
					( {_id} ) =>{ 
						this.done = true;
						this.snackBar.open(`Se ha actualizado el usuario exitosamente`,
											'x',
											{ duration: 2500, verticalPosition: 'top', panelClass: ['snackbar-color'] }
						);

						this.router.navigate(['/admin'])
					},
					(error) => {
						//Error en el servidor
						console.log('Función de error en el subscribe');
						console.log(error);
						if (error.error==='Nombre de usuario ingresado ya está en uso') {
							this.snackBar.open(error.error,
												'x',
												{ duration: 2500, verticalPosition: 'top', panelClass: ['snackbar-color']}
							);
							this.loading=false;
						} else {
							this.snackBar.open(error,
												'x',
												{ duration: 2500, verticalPosition: 'top', panelClass: ['snackbar-color']}
							);
							//this.loading = false
							this.router.navigateByUrl('/admin');
						}
						
					}
				);
		} else {
			this.snackBar.open(`¡Verifica los datos e intenta nuevamente!`,
								'x',
								{ duration: 2500, verticalPosition: 'top', panelClass: ['snackbar-color']}
			);
		}

	}
}