import mongoose, { Schema } from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'

const UserSchema = Schema({
	firstName: { type: String, required: true},
	lastName: { type: String, required: true},
	userName: { type: String, required: true, unique: true, index: true},
	password: { type: String, required: true}

})

UserSchema.plugin(uniqueValidator)

//mongoose.model recibe el nombre del modelo y el schema
export default mongoose.model('User', UserSchema)