import { Component, Input } from '@angular/core';
import { SelectionActivity } from '../../activities/selectionActivity.model';

@Component({
    selector: 'app-summary-component',
    templateUrl: './summary.component.html',
    styleUrls: ['./summary.component.css']
})

export class SummaryComponent {
    
    @Input() activities: SelectionActivity[];
    @Input() selectedAnswers: any[] = [];
    
    constructor() {}

}