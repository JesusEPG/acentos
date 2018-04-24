import mongoose, { Schema } from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'

const AdminSchema = Schema({
	firstName: { type: String, required: true},
	lastName: { type: String, required: true},
	email: { type: String, required: true, unique: true, index: true},
	role: {type: String, required: true, default: 'admin'},
	password: { type: String, required: true},
})

AdminSchema.plugin(uniqueValidator)

//mongoose.model recibe el nombre del modelo y el schema
export default mongoose.model('Admin', AdminSchema)