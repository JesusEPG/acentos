import express from 'express'
import { required, simpleSelectionActivityMiddleware } from '../middleware'
import { activities} from '../db-api'
import { handleError } from '../utils'
import { User, Activity } from '../models'


const app = express.Router()


//Estas rutas son un agregado a la ruta definida en app.js

// 	GET	/api/admin/users
app.get('/users', async (req, res) => {

	User.find({}, function(err, users){
		if(err){
			console.log(err)
			return handleError(err, res)
		}
		res.status(200).json(users)
	})
})

// 	GET	/api/admin/user/:id
app.get('/user/:id', async (req, res) => {

	const id = req.params.id

	User.findOne({ _id: id }, function(err, user){
		if(err){
			console.log(err)
			return handleError(err, res)
		}

		console.log(user)
		res.status(200).json(user)
	})

	/*User.find({_id:req.params.id}, function(err, user){
		if(err){
			console.log(err)
			handleError(err, res)
		}
		res.status(200).json(user)
	})*/
})

// 	GET	/api/admin/activities
app.get('/activities', async (req, res) => {

	//res.status(200).json([])

	try {

		const result = await activities.findAllActivities()
		res.status(200).json(result)
		
	} catch(err) {
		// statements
		console.log(err);
		return handleError(err, res)
	}
})


// 	GET	/api/activities/selection
app.get('/selection', required, async (req, res) => {

	console.log(req.user._id)
	try {
		const simpleSelectionActivities = await activities.findSelectionActivities(req.user._id)
		//let result = await activities.testQuery(req.user._id)
		console.log('Selection')
		console.log(simpleSelectionActivities)
		let result = simpleSelectionActivities.map(function(activity, index){
			return {
				activity: activity.activities.activity,
				difficulty: activity.activities.difficulty,
				lastAttempt: activity.activities.lastAttempt,
				reviewInterval: activity.activities.reviewInterval,
				percentOverDue: activity.activities.percentOverDue,
				type: activity.activities.type,
				correctAnswer: activity.fromActivities[0].correctAnswer,
				possibleAnswers: activity.fromActivities[0].possibleAnswers,
				splittedString: activity.fromActivities[0].splittedString,
				comment: activity.fromActivities[0].comment,
				fullString: activity.fromActivities[0].fullString
			}
		})
		//console.log(simpleSelectionActivities)
		console.log('Resultado')
		console.log(result)
		res.status(200).json(result)
	} catch (err) {
		handleError(err, res)
	}
})


// 	GET	/api/activities/mistakes
app.get('/mistakes', required, async (req, res) => {

	console.log(req.user._id)
	try {
		const simpleSelectionActivities = await activities.findMistakesActivities(req.user._id)
		//let result = await activities.testQuery(req.user._id)
		console.log('Selection')
		console.log(simpleSelectionActivities)
		let result = simpleSelectionActivities.map(function(activity, index){
			return {
				activity: activity.activities.activity,
				difficulty: activity.activities.difficulty,
				lastAttempt: activity.activities.lastAttempt,
				reviewInterval: activity.activities.reviewInterval,
				percentOverDue: activity.activities.percentOverDue,
				type: activity.activities.type,
				correctAnswer: activity.fromActivities[0].correctAnswer,
				possibleAnswers: activity.fromActivities[0].possibleAnswers,
				splittedString: activity.fromActivities[0].splittedString,
				comment: activity.fromActivities[0].comment,
				fullString: activity.fromActivities[0].fullString
			}
		})
		//console.log(simpleSelectionActivities)
		console.log('Resultado')
		console.log(result)
		res.status(200).json(result)
	} catch (err) {
		handleError(err, res)
	}
})

//	GET	/api/questions/:id
/*app.get('/:id', simpleSelectionActivityMiddleware, async (req, res) => {

	try{
		res.status(200).json(req.simpleSelectionActivity)

	} catch (err) {
		handleError(err, res)
	}

})*/

//	POST  /api/simpleSelection
//app.post('/', required, async (req, res) => {
app.post('/updateActivities', required, async (req, res) => {

	const toUpdate = req.body

	toUpdate.forEach( async function(activity, index) {
		// statements
		try {
			const savedActivity = await activities.updateUserActivities(req.user._id, activity)
			console.log(savedActivity)
		} catch (err){
			console.log(err)
			//handleError(err, res)
		}
	})

	res.status(201).json({message: 'Todo Bien'})
})

//	POST  /api/admin/updateUser
//app.post('/', required, async (req, res) => {
app.post('/updateUser', async (req, res) => {

	const { firstName, lastName, userName, password, _id } = req.body

	if(userName){
		//verificar que userName no este almacenado en base de datos
		const user = await User.find({userName: userName})
		if (user){
			console.log(user)
			return res.status(401).json({
				message:'Actualización de usuario falló',
				error: 'Nombre de usuario ingresado ya está en uso'
			})
		}
		//si no está almacenado ese userName se actualiza
		try {
			// statements
			const userUpdated = await User.findOneAndUpdate({"_id": _id}, { $set: { 
					
					"firstName": firstName,
					"lastName": lastName,
					"userName": userName,
					"modified": true
				} 
			}, {new: true})
			console.log('Usuario Actualizado: ')
			console.log(userUpdated)

			res.status(201).json({
				message: 'Usuario Actualizado',
				userId: userUpdated._id,
				firstName: userUpdated.firstName,
				lastName: userUpdated.lastName,
				userName: userUpdated.userName
			})
		} catch(err) {
			// statements
			console.log(err)
			handleError(err, res)
		}

	} else {
		//Update normal de nombre y apellido
		try {
			// statements
			const userUpdated = await User.findOneAndUpdate({"_id": _id}, { $set: { 
					
					"firstName": firstName,
					"lastName": lastName,
					"modified": true
				} 
			}, {new: true})

			console.log('Usuario Actualizado: ')
			console.log(userUpdated)

			res.status(201).json({
				message: 'Usuario Actualizado',
				userId: userUpdated._id,
				firstName: userUpdated.firstName,
				lastName: userUpdated.lastName
			})
		} catch(err) {
			// statements
			console.log(err)
			handleError(err, res)
		}
	}
})

//	POST  /api/admin/deleteActivity
//app.post('/', required, async (req, res) => {
app.post('/deleteActivity', async (req, res) => {

	const toDelete = req.body._id

	console.log(toDelete)

	//const deletedActivity = await Activity.findOneAndRemove({_id: toDelete})

	Activity.findOneAndRemove({_id: toDelete}, async function(err, activity){
		if(err) handleError(err, res)

		try {
			// statements
			await activity.remove()
	 		console.log('Luego del hook')
	 		res.status(201).json({message: 'U eliminada exitosamente', _id: '123'})
		} catch(err) {
			// statements
			console.log(err)
			handleError(err, res)
		}
	})

})

//	POST  /api/admin/deleteUser
//app.post('/', required, async (req, res) => {
app.post('/deleteUser', async (req, res) => {

	const toDelete = req.body._id

	console.log(toDelete)

	//const deletedActivity = await Activity.findOneAndRemove({_id: toDelete})

	User.findOneAndRemove({_id: toDelete}, async function(err, user){
		if(err) handleError(err, res)

		try {
			// statements
			await user.remove()
	 		res.status(201).json({message: 'Usuario eliminado exitosamente', _id: '123'})
		} catch(err) {
			// statements
			console.log(err)
			handleError(err, res)
		}
	})

})

//	POST  /api/simpleSelection
//app.post('/', required, async (req, res) => {
app.post('/newSelectionActivity', async (req, res) => {

	console.log('Llegó a la ruta del server');

	const {difficulty, type, comment, fullString, splittedString, correctAnswer, possibleAnswers, createdAt } = req.body
	const activity = {
		difficulty,
		type,
		comment,
		fullString,
		splittedString,
		correctAnswer,
		possibleAnswers,
		createdAt
		//user: req.user._id
	}

	try {
		//El db api debe ser solo de selection
		const savedActivity = await activities.createActivity(activity)
		try {
			//Hacer que updateUsers sea una promesa para poder validar errores
			const test = await activities.updateUsersActivities(savedActivity)
			res.status(201).json(savedActivity)
		} catch (err) {
			console.log(err)
			handleError(err, res)
		}
	} catch (err){
		console.log(err)
		handleError(err, res)
	}
})

//	POST  /api/activities/newMistakeActivity
//app.post('/', required, async (req, res) => {
app.post('/newMistakeActivity', async (req, res) => {

	console.log('Llegó a la ruta del server');

	const {difficulty, type, comment, fullString, splittedString, correctAnswer, possibleAnswers, createdAt } = req.body
	const activity = {
		difficulty,
		type,
		comment,
		fullString,
		splittedString,
		correctAnswer,
		possibleAnswers,
		createdAt
		//user: req.user._id
	}

	try {
		//El db api debe ser solo de selection
		const savedActivity = await activities.createActivity(activity)
		try {
			//Hacer que updateUsers sea una promesa para poder validar errores
			const test = await activities.updateUsersActivities(savedActivity)
			res.status(201).json(savedActivity)
		} catch (err) {
			console.log(err)
			handleError(err, res)
		}
	} catch (err){
		console.log(err)
		handleError(err, res)
	}
})


//	POST  /api/questions/:id/answers
/*app.post('/:id/answers', required, simpleSelectionActivityMiddleware, async (req, res) => {
	const answer = req.body
	const q = req.simpleSelectionActivity
	answer.createdAt = new Date()
	answer.user = new User(req.user)
	
	try {
		const savedAnswer = await simpleSelection.createAnswer(q, answer)
		res.status(201).json(savedAnswer)
	} catch (err){
		handleError(err, res)
	}
})*/


// Aqui van las rutas
export default app