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
    	lastAnswer: {type: Boolean, default: null},
    	modified: {type: Boolean, default: false},
    	taken: {type: Boolean, default: false}
	}]

})

/*UserSchema.post('aggregate', async function(docs, next) {
  
	console.log('Triggeando el middleware de aggregate!!!')
	//console.log(await this._model)
	// this now works
    this.constructor.findOne({}, function(err, doc) {
        console.log(err);
        console.log(doc);
        //next(err, doc);
    });
	//console.log(docs[0])
  	docs.forEach(doc => { doc.activities.taken = true; });
  	next();
});*/


/*ActivitySchema.pre('remove', async function(next){

	console.log('Se está triggeando el hook de pre remove')
	await this.model('User').updateMany({}, {$pull: {activities: {activity: this._id}}})
	//this.model('User').remove({}, next);
	next()
})*/


UserSchema.plugin(uniqueValidator)

//mongoose.model recibe el nombre del modelo y el schema
export default mongoose.model('User', UserSchema)