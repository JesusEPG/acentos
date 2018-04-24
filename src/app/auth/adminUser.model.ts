export class AdminUser {
	constructor(
		public email: string,
		public password: string,
		public firstName?: string,
		public lastName?: string,
		public _id?: string,
		public role?: string
	) {}

	fullName() {
		return `${this.firstName} ${this.lastName}`;
	}
}