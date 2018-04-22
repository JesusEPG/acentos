export class SimpleSelectionActivity {
	constructor(
		public difficulty: number,
		public type: string,
		public comment: string,
		public fullString: string,
		public splittedString: any[],
		public correctAnswer: any,
		public possibleAnswers: any[]=[],
		public createdAt?: Date,
		public _id?: string 
	) {}
}