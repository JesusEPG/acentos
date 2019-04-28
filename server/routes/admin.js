import express from 'express'
import { required, adminRequired } from '../middleware'
import { activities} from '../db-api'
import { handleError } from '../utils'
import { User, Activity } from '../models'
import {
	hashSync as hash,
	compareSync as comparePasswords
} from 'bcryptjs'


const app = express.Router()

// 	GET	/api/admin/users
app.get('/users', adminRequired, async (req, res) => {

	User.find({}, function(err, users){
		if(err){
			console.log(err)
			return handleError(err, res)
		}
		res.status(200).json(users)
	})
})

// 	GET	/api/admin/user/:id
app.get('/user/:id', adminRequired, async (req, res) => {

	const id = req.params.id

	User.findOne({ _id: id }, function(err, user){
		if(err){
			console.log(err)
			return handleError(err, res)
		}

		res.status(200).json(user)
	})

})

// 	GET	/api/admin/activities
app.get('/activities', adminRequired, async (req, res) => {

	

	try {
		const result = await activities.findAllActivities()
		res.status(200).json(result)
		
	} catch(err) {
		
		console.log(err);
		return handleError(err, res)
	}
})

//	POST  /api/admin/updateUser
app.post('/updateUser', adminRequired, async (req, res) => {

	const { firstName, lastName, userName, password, school, grade, _id } = req.body

	

	if(userName){
		//verificar que userName no este almacenado en base de datos
		const user = await User.findOne({userName: userName})
		if (user){
			return res.status(401).json({
				message:'Actualización de usuario falló',
				error: 'Nombre de usuario ingresado ya está en uso'
			})
		}
		//si no está almacenado ese userName se actualiza
		try {
			
			let userUpdated
			if (password) {
				userUpdated = await User.findOneAndUpdate({"_id": _id}, { $set: { 
					
					"firstName": firstName,
					"lastName": lastName,
					"userName": userName,
					"modified": true,
					"school": school,
					"grade": grade,
					"password": hash(password, 10)
				} 
			}, {new: true})
			} else {
				userUpdated = await User.findOneAndUpdate({"_id": _id}, { $set: { 
					
						"firstName": firstName,
						"lastName": lastName,
						"userName": userName,
						"modified": true,
						"school": school,
						"grade": grade
					} 
				}, {new: true})
			}

			if (userUpdated) {
					res.status(201).json({
					message: 'Usuario Actualizado',
					userId: userUpdated._id,
					firstName: userUpdated.firstName,
					lastName: userUpdated.lastName,
					userName: userUpdated.userName,
					school: userUpdated.school,
					grade: userUpdated.grade
				})
			} else {
				res.status(500).json({
					message: 'Ha ocurrido un error. Contacte al profesor',
					error: {error: 'No se encontró el usuario', message: 'Contactar al profesor', name: 'User has been modified' }
				})
			}
		} catch(err) {
			
			console.log(err)
			handleError(err, res)
		}

	} else {
		//Update normal de nombre y apellido
		try {
			
			let userUpdated
			if (password) {
				userUpdated = await User.findOneAndUpdate({"_id": _id}, { $set: { 
					
					"firstName": firstName,
					"lastName": lastName,
					"modified": true,
					"school": school,
					"grade": grade,
					"password": hash(password, 10)
				} 
			}, {new: true})
			} else {
				userUpdated = await User.findOneAndUpdate({"_id": _id}, { $set: { 
					
						"firstName": firstName,
						"lastName": lastName,
						"modified": true,
						"school": school,
						"grade": grade
					} 
				}, {new: true})
			}


			if (userUpdated) {
					res.status(201).json({
					message: 'Usuario Actualizado',
					userId: userUpdated._id,
					firstName: userUpdated.firstName,
					lastName: userUpdated.lastName,
					school: userUpdated.school,
					grade: userUpdated.grade
				})
			} else {
				res.status(500).json({
					message: 'Ha ocurrido un error. Contacte al profesor',
					error: {error: 'No se encontró el usuario', message: 'Contactar al profesor', name: 'User has been modified' }
				})
			}

			
		} catch(err) {
			
			console.log(err)
			handleError(err, res)
		}
	}
})

//	POST  /api/admin/deleteActivity
app.post('/deleteActivity', adminRequired, async (req, res) => {

	const toDelete = req.body._id

	Activity.findOneAndRemove({_id: toDelete}, async function(err, activity){
		if(err) return handleError(err, res)

		else if(activity){
			try {
				const deletedActivity = await activity.remove()
		 		res.status(201).json({message: 'Se ha eliminado la actividad exitosamente', id: deletedActivity._id })
			} catch(err) {
				return handleError(err, res)
			}
		} else {
			res.status(500).json({
				message: 'Ha ocurrido un error al buscar la actividad. Contacte al profesor'
			})
		}
	})

})

//	POST  /api/admin/deleteUser
app.post('/deleteUser', adminRequired, async (req, res) => {

	const toDelete = req.body._id

	User.findOneAndRemove({_id: toDelete}, async function(err, user){
		if(err) handleError(err, res)

		else if(user) {
			try {
				const deletedUser = await user.remove()
		 		res.status(201).json({message: 'Se ha eliminado el usuario exitosamente', id: deletedUser._id })
			} catch(err) {
				console.log(err)
				return handleError(err, res)
			}
		} else {
			res.status(500).json({
				message: 'Ha ocurrido un error al buscar la actividad. Contacte al profesor'
			})
		}
	})

})

export default app