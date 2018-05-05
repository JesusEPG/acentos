import mongoose, { Schema } from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'

const UserSchema = Schema({
	firstName: { type: String, required: true},
	lastName: { type: String, required: true},
	userName: { type: String, required: true, unique: true, index: true},
	password: { type: String, required: true},
	//activities: [{}]
	activities: [{ 
		activity: { type: Schema.Types.ObjectId, ref: 'SimpleSelectionActivity', required: true },
		type: {type: String, required: true},
		difficulty: { type: Number, required: true, min: 0, max: 1 },
    	percentOverDue: {type: Number, required: true, default: 1 },
    	//dueDate: today + interval,
    	reviewInterval: {type: Number, required: true, default: 1 },
    	lastAttempt: {type: Date, default: null, index: true },
    	correctCount: {type: Number, default: 0},
    	incorrectCount: {type: Number, defaul: 0},
    	lastAnswer: {type: Boolean, default: null}
	}]

})

UserSchema.plugin(uniqueValidator)

//mongoose.model recibe el nombre del modelo y el schema
export default mongoose.model('User', UserSchema)