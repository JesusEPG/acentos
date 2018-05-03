import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth/auth.service';
import { User } from '../auth/user.model';
import { Router, ActivatedRoute } from '@angular/router';
import { AdminService } from './admin.service';

@Component({
	selector: 'app-update-user-component',
	templateUrl: './updateUser.component.html',
	styleUrls: ['./updateUser.component.css']
})

export class UpdateUserComponent implements OnInit {

	userUpdateForm: FormGroup;
	private user?: User;
	loading: boolean = true;

	constructor(private adminService: AdminService,
				private router: Router,
				private route: ActivatedRoute,){}

	ngOnInit(){
		this.userUpdateForm = new FormGroup({
			firstName: new FormControl(null, Validators.required),
			lastName: new FormControl(null, Validators.required),
			userName: new FormControl(null, [
			Validators.required//,
				//Validators.pattern(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)
			]),
			password: new FormControl(null)
		});

		this.route.params.subscribe( params => 
			this.adminService
			.getUser(params['_id'])
			.then((user: User) => {
				this.user = user;
				console.log(this.user);
				//console.log(this.activities.length);
				this.userUpdateForm.patchValue({
				  firstName: this.user.firstName,
				  lastName: this.user.lastName,
				  userName: this.user.userName
				});
				this.loading = false;
			}))

	}

	onSubmit() {
		if(this.userUpdateForm.valid){
			const {firstName, lastName, userName, password} = this.userUpdateForm.value;
			const username = userName === this.user.userName? null : userName;
			const user = new User(username, null, firstName, lastName, this.user._id);
			console.log(user);
			console.log(`Nombre Completo: ${firstName} ${lastName}, Username: ${userName}, Contraseña: ${password}`);
			this.adminService.updateUser(user)
				.subscribe(
					() => this.router.navigate(['/admin']),
					//err => console.log(err)
					this.adminService.handleError
				);
			this.userUpdateForm.reset();
		}
	}
}