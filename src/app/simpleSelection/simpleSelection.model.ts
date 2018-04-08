export class simpleSelectionActivity {
	constructor(
		public difficulty: number,
		public comment: string,
		public fullString: string,
		public splittedString: any[],
		public correctAnswer: any,
		public possibleAnswers: any[]=[],
		public _id?: string 
	) {}

	fullName() {}
}