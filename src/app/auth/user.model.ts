export class User {
	constructor(
		public userName: string,
		public password: string,
		public firstName?: string,
		public lastName?: string,
		public _id?: string 
	) {}

	fullName() {
		return `${this.firstName} ${this.lastName}`;
	}
}