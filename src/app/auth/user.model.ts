export class User {
	constructor(
		public userName: string,
		public password: string,
		public firstName?: string,
		public lastName?: string,
		public school?: string,
		public grade?: string,
		public _id?: string,
		public activities?: any[]
	) {}

	fullName() {
		return `${this.firstName} ${this.lastName}`;
	}
}