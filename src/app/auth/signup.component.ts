import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AuthService } from './auth.service';
import { User } from './user.model';
import { noWhitespaceValidator } from '../utils/noWhitespaces.validator';

@Component({
	selector: 'app-signup-component',
	templateUrl: './signup.component.html',
	styleUrls: ['./signup.component.css']
})

export class SignupComponent implements OnInit {

	signupForm: FormGroup;
	loading: boolean = false;

	uploadedImage: any;
	imageChangedEvent: any = '';
	croppedImage: any = '';
	cropperOnPage: boolean = false;

	constructor(private authService: AuthService,
				private snackBar: MatSnackBar){}

	ngOnInit(){
		this.signupForm = new FormGroup({
			firstName: new FormControl(null, [Validators.required, Validators.maxLength(50), noWhitespaceValidator, Validators.pattern(/^[a-zA-ZáÁéÉíÍóÓúÚñÑ]+$/)]),
			lastName: new FormControl(null, [Validators.required, Validators.maxLength(50), noWhitespaceValidator, Validators.pattern(/^[a-zA-ZáÁéÉíÍóÓúÚñÑ]+$/)]),
			userName: new FormControl(null, [Validators.required, Validators.maxLength(20), noWhitespaceValidator]),
			school: new FormControl(null, [Validators.required, Validators.maxLength(100), noWhitespaceValidator]),
			grade: new FormControl(null, [Validators.required]),
			password: new FormControl(null, [Validators.required, Validators.maxLength(10), noWhitespaceValidator])
		});

	}

	onFileChange(event: any) {
		console.log(event);
		let reader = new FileReader();
		if(event.target.files && event.target.files.length > 0) {
			let file = event.target.files[0];
			reader.readAsDataURL(file);
			reader.onload = () => {
				console.log(event);
				console.log('Reader result');
				console.log(reader.result);
				// this.uploadedImage = event.target.result;
				this.uploadedImage = reader.result;
			}
		}
	}

	fileChangeEvent(event: any): void {
		this.cropperOnPage = true;
        this.imageChangedEvent = event;
	}
	
    imageCropped(event: ImageCroppedEvent) {
		console.log(event);
		this.croppedImage = event.base64;
		console.log('Cambio la imagen');
		
	}
	
    imageLoaded() {
        // show cropper
	}
	
    cropperReady() {
		// cropper ready
		// this.cropperOnPage = true;
	}
	
    loadImageFailed() {
        // show message
    }

	onSubmit() {
		if(this.signupForm.valid){
			this.loading = true;
			const {firstName, lastName, userName, password, school, grade} = this.signupForm.value;
			const user = new User(userName, password, firstName, lastName, school, grade, this.croppedImage);
			this.authService.signup(user)
				.subscribe(
					this.authService.login,
					// () => {console.log('Exito')},
					(error) => {
						//Error en el servidor
						console.log('Error');
						if(error==="Registro de usuario falló. Nombre de usuario ya está en uso"){
							this.snackBar.open(error,
												'x',
												{ duration: 2500, verticalPosition: 'top', panelClass: ['snackbar-color']}
							);
							this.loading = false;
						} else {
							this.snackBar.open(error,
												'x',
												{ duration: 2500, verticalPosition: 'top', panelClass: ['snackbar-color']}
							);
							this.authService.logout();
						}
					}
				);
		} else {
			//Not valid
			this.snackBar.open(`Verifica los datos e intenta nuevamente!`,
								'x',
								{ duration: 2500, verticalPosition: 'top', panelClass: ['snackbar-color']}
			);
		}
	}
}