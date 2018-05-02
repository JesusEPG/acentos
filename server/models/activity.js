import mongoose, { Schema } from 'mongoose'

//const { ObjectId } = Schema.Types

const ActivitySchema = Schema({
	difficulty: { type: Number, required: true },
	type: {type: String, required: true},
	comment: { type: String, required: true },
	fullString: { type: String, required: true },
	splittedString: [{}],
	//correctAnswer: {type: Object, required: true},
	correctAnswer: {id: Number, word: String, hidden: Boolean, clickeable: {type: Boolean, required: true}, selected: {type: Boolean}}, //correcto
	//possibleAnswers: [{type: Object, required: true}],
	possibleAnswers: [{}],
	createdAt: { type: Date, required: true, default: new Date()}
	//user: {type: Schema.Types.ObjectId, ref: 'User', required: true },
	//answers: [{ type: Schema.Types.ObjectId, ref: 'Answer', default: [] }]
})

ActivitySchema.pre('remove', async function(next){

	console.log('Se está triggeando el hook de pre remove')
	await this.model('User').updateMany({}, {$pull: {activities: {activity: this._id}}})
	//this.model('User').remove({}, next);
	next()
})


export default mongoose.model('Activity', ActivitySchema)