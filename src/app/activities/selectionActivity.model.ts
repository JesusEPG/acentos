export class SelectionActivity {
	constructor(
		public activity: string,
		public difficulty: number,
		public lastAttempt: Date,
		public reviewInterval: number,
		public percentOverDue: number,
		public type?: string,
		public correctAnswer?: any,
		public possibleAnswers?: any[],
		public splittedString?: any[],
		public comment?: string,
		public fullString?: string
	) {}

	completeString() {}

	updateByReview(difficulty, percent, interval, dateLastReviewed) {
		this.difficulty = difficulty;
		this.percentOverDue = percent;
		this.reviewInterval = interval;
		this.lastAttempt = dateLastReviewed;
	}
}