import { Component, OnInit, TemplateRef } from '@angular/core';
import { AdminService } from './admin.service';
import { User } from '../auth/user.model';
import { MistakeActivity } from '../mistakes/mistake.model';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
	selector: 'app-activity-list-component',
	templateUrl: './activityList.component.html',
	styleUrls: ['./activityList.component.css'],
	providers: [AdminService]
})

export class ActivityListComponent implements OnInit {

	loading: boolean = true;
	p: number = 1;
    array: any[] = ['hola', 'como', 'estas', 'hola', 'como', 'estas', 'hola', 'como', 'estas', 'hola', 'como', 'estas'];
	activities: MistakeActivity[];
	modalRef: BsModalRef;
  	message: string;
  	public filter: string = '';

	constructor(private adminService: AdminService,
				private router: Router,
				private modalService: BsModalService,
				public snackBar: MatSnackBar){}

	ngOnInit(){

		this.adminService
			.getActivities()
			.then((activities: MistakeActivity[]) => {
				//Exitoso
				this.activities = activities;
				this.loading = false;
			}, (error) => { 
				//Error en el servidor
				console.log('Función de error en el then');
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

	deleteActivity(activityId){

		console.log('Boton component list');
		this.adminService.deleteActivity(activityId)
				.subscribe(
					//( {_id} ) => this.router.navigate(['/questions', _id]),
					//this.router.navigate(['/']),
					( {_id} ) => {
						this.router.navigate(['/admin']);
						console.log('Exitoso')
						console.log(_id);
					},
					this.adminService.handleError
				);

	}

	  openModal(template: TemplateRef<any>) {
	    this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
	  }
	 
	  confirm(activityId): void {
	    this.message = 'Confirmed!';
	    this.loading = true;
	    this.modalRef.hide();
	    this.adminService.deleteActivity(activityId)
				.subscribe(
					//( {_id} ) => this.router.navigate(['/questions', _id]),
					//this.router.navigate(['/']),
					( {message, id} ) => {
						this.snackBar.open(	message, 
											'x',
											{duration: 2500, verticalPosition: 'top', panelClass: ['snackbar-color']}
						);
						//this.loading = false;
						this.router.navigate(['/admin']);
					},
					//this.adminService.handleError
					(error) => {
						console.log('En el component');
						console.log(error);

						//Error en el servidor
						console.log('Función de error en el then');
						this.snackBar.open(error,
											'x',
											{ duration: 4500, verticalPosition: 'top', panelClass: ['snackbar-color']}
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
