import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-preview-component',
    templateUrl: './activityPreview.component.html',
    styleUrls: ['./activityPreview.component.css']
})

export class ActivityPreviewComponent {
    @Input() activityType: string;
    @Output() indicationsAccepted = new EventEmitter();

    handleClick() {
        this.indicationsAccepted.emit();
    }
}