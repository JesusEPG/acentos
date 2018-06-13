import mongoose, { Schema } from 'mongoose'

//const { ObjectId } = Schema.Types

const ActivitySchema = Schema({
	difficulty: { type: Number, required: true },
	type: {type: String, required: true},
	comment: { type: String, required: true, default: 'Seguir Repasando' },
	fullString: { type: String, required: true },
	splittedString: [{}],
	correctAnswer: {id: Number, word: String, hidden: Boolean, clickeable: {type: Boolean, required: true}, selected: {type: Boolean}}, //correcto
	possibleAnswers: [{}],
	createdAt: { type: Date, required: true, default: new Date()}
})

ActivitySchema.pre('remove', async function(next){

	console.log('Se está triggeando el hook de pre remove')
	await this.model('User').updateMany({}, {$pull: {activities: {activity: this._id}}})
	//this.model('User').remove({}, next);
	next()
})


export default mongoose.model('Activity', ActivitySchema)