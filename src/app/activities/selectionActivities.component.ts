import { Component } from '@angular/core';
import { SelectionActivity } from './selectionActivity.model';
import { ActivitiesService } from './activities.service';

@Component({
	selector: 'app-selection-component',
	templateUrl: 'selectionActivities.component.html',
	providers: [ActivitiesService]
})

export class SelectionActivitiesComponent {

	activities: SelectionActivity[];
	counter:number = 0;
	loading = true;

	constructor(private activitiesService: ActivitiesService){

	}

	ngOnInit() {
		this.activitiesService
			.getSelectionActivities()
			.then((activities: SelectionActivity[]) => {
				console.log(activities);
				/*this.activities = activities;
				console.log(this.activities);
				console.log(this.activities[1]);*/
				this.loading = false;
			});
	}
	
	next() {
		this.counter++;
	}
	
}
