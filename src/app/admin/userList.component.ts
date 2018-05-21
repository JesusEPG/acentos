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
				this.loading = false;
			}, (error) => { 
				//Error en el servidor
				console.log('Función de error en el subscribe');
				this.snackBar.open(error.message,
									'x',
									{ duration: 4500, verticalPosition: 'top', panelClass: ['snackbar-color']}
				);
				this.router.navigateByUrl('/admin');

			})
			.catch((error) => {
				//Error en el then
				this.snackBar.open(`Problemas al obtener las actividades. Intenta más tarde`,
									'x',
									{ duration: 2500, verticalPosition: 'top', panelClass: ['snackbar-color']}
				);
				this.router.navigateByUrl('/admin');
			});
	}

	openModal(template: TemplateRef<any>) {
		this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
	}
	 
	confirm(userId): void {
		this.loading = true;
	    this.message = 'Confirmed!';
	    this.modalRef.hide();
	    this.adminService.deleteUser(userId)
			.subscribe(
					
					( {message, id} ) => {
						this.snackBar.open(	message, 
											'x',
											{duration: 2500, verticalPosition: 'top', panelClass: ['snackbar-color']}
						);
						this.loading = false;
						this.router.navigate(['/admin']);
					},
					(error) => {
						console.log('En el component');
						console.log(error);

						//Error en el servidor
						console.log('Función de error en el subscribe');
						this.snackBar.open(error,
											'x',
											{ duration: 2500, verticalPosition: 'top', panelClass: ['snackbar-color']}
						);
						this.router.navigateByUrl('/admin');
					}
				);
	}
	 
	decline(): void {
	    this.message = 'Declined!';
	    this.modalRef.hide();
	}
} 
