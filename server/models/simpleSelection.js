import mongoose, { Schema } from 'mongoose'

//const { ObjectId } = Schema.Types

const SimpleSelectionActivitySchema = Schema({
	difficulty: { type: Number, required: true },
	comment: { type: String, required: true },
	fullString: { type: String, required: true },
	splittedString: [{}],
	//correctAnswer: {type: Object, required: true},
	correctAnswer: {id: Number, word: String, hidden: Boolean, clickeable: {type: Boolean, required: true}}, //correcto
	//possibleAnswers: [{type: Object, required: true}],
	possibleAnswers: [{}],
	createdAt: { type: Date, required: true, default: Date.now}
	//user: {type: Schema.Types.ObjectId, ref: 'User', required: true },
	//answers: [{ type: Schema.Types.ObjectId, ref: 'Answer', default: [] }]
})


export default mongoose.model('SimpleSelectionActivity', SimpleSelectionActivitySchema)