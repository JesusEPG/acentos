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
				this.activities = activities;
				this.loading = false;
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
	    this.modalRef.hide();
	    this.adminService.deleteActivity(activityId)
				.subscribe(
					//( {_id} ) => this.router.navigate(['/questions', _id]),
					//this.router.navigate(['/']),
					( {_id} ) => {
						this.snackBar.open('Se ha eliminado la actividad exitosamente', 'x', { duration: 20000,
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
