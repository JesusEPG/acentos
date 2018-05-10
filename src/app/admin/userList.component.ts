import { Component, OnInit, TemplateRef } from '@angular/core';
import { AdminService } from './admin.service';
import { User } from '../auth/user.model';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
	selector: 'app-user-list-component',
	templateUrl: './userList.component.html',
	styleUrls: ['./userList.component.css'],
	providers: [AdminService]
})

export class UserListComponent implements OnInit {

	loading: boolean = true;
	p: number = 1;
    array: any[] = ['hola', 'como', 'estas', 'hola', 'como', 'estas', 'hola', 'como', 'estas', 'hola', 'como', 'estas'];
	users: User[];
	modalRef: BsModalRef;
  	message: string;
  	public filter: string = '';

	constructor(private adminService: AdminService,
				private router: Router,
				private modalService: BsModalService,
				public snackBar: MatSnackBar){}

	ngOnInit(){

		this.adminService
			.getUsers()
			.then((users: User[]) => {
				this.users = users;
				//console.log(this.users);
				//console.log(this.users.length);
				this.loading = false;
			});
	}

	openModal(template: TemplateRef<any>) {
		this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
	}
	 
	confirm(userId): void {
	    this.message = 'Confirmed!';
	    this.modalRef.hide();
	    this.adminService.deleteUser(userId)
			.subscribe(
				//( {_id} ) => this.router.navigate(['/questions', _id]),
				//this.router.navigate(['/']),
				( {_id} ) => {
					this.snackBar.open('Se ha eliminado el usuario exitosamente', 'x', { duration: 20000,
					panelClass: 'container-fixed-footer', verticalPosition: 'top' });
					
					this.router.navigate(['/admin']);
						console.log('Exitoso')
						console.log(_id);
				},
				this.adminService.handleError
			);
	}
	 
	decline(): void {
	    this.message = 'Declined!';
	    this.modalRef.hide();
	}
} 
