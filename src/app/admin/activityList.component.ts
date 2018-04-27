import { Component, OnInit } from '@angular/core';
import { AdminService } from './admin.service';
import { User } from '../auth/user.model';
import { MistakeActivity } from '../mistakes/mistake.model';

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

	constructor(private adminService: AdminService){}

	ngOnInit(){

		this.adminService
			.getMistakeActivities()
			.then((activities: MistakeActivity[]) => {
				this.activities = activities;
				console.log(this.activities);
				console.log(this.activities.length);
				this.loading = false;
			});
	}
} 
