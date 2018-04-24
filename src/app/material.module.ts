import { NgModule } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';

const modules = [
	MatProgressSpinnerModule,
	MatSnackBarModule
]

@NgModule({
	imports: modules,
	exports: modules
})

export class MaterialModule {}

