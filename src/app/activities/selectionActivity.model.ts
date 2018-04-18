export class SelectionActivity {
	constructor(
		public activity: string,
		public difficulty: number,
		public correctAnswer: any,
		public possibleAnswers: any[]=[],
		public splittedString: any[],
		public comment: string,
		public fullString: string,
		public lastAttempt: number,
		public reviewInterval: number,
		public percentOverDue: number
	) {}

	completeString() {}
}