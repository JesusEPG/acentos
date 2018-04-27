import { Component, OnInit } from '@angular/core';
import { AdminService } from './admin.service';
import { User } from '../auth/user.model';

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

	constructor(private adminService: AdminService){}

	ngOnInit(){

		this.adminService
			.getUsers()
			.then((users: User[]) => {
				this.users = users;
				console.log(this.users);
				console.log(this.users.length);
				this.loading = false;
			});
	}
} 