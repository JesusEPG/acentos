import express from 'express'
import moment from 'moment';
import { required, adminRequired } from '../middleware'
import { activities} from '../db-api'
import { handleError } from '../utils'
import { User } from '../models'


const app = express.Router()

// 	GET	/api/activities/mistakes
app.get('/mistakes', required, async (req, res) => {

	/*const test = [];

	return res.status(200).json(test)*/

	console.log('ENTRANDO A ACTIVITIES')
	
	var result = []

	try {

		//Obtengo las actividades
		const fetchedActivities = await activities.findMistakesActivities(req.user._id)

		User.findById({_id: req.user._id}, async function(err, user){

			if (err) {
				console.log(err)
				return handleError(err, res)
			}

			fetchedActivities.forEach(async function(activity, index) {
				//Para cada actividad en fetchedactivities se marcan como taken
				//y se crea el objeto con todos los datos para devolver al client

				var subDoc = user.activities.id(activity.activities._id);
				subDoc.set({taken: true})

				result.push({
							activity: activity.activities.activity,
							difficulty: activity.activities.difficulty,
							lastAttempt: activity.activities.lastAttempt,
							reviewInterval: activity.activities.reviewInterval,
							percentOverDue: activity.activities.percentOverDue,
							correctCount: activity.activities.correctCount,
			    			incorrectCount: activity.activities.incorrectCount,
			    			lastAnswer: activity.activities.lastAnswer,
			    			_id: activity.activities._id,
							type: activity.activities.type,
							correctAnswer: activity.fromActivities[0].correctAnswer,
							possibleAnswers: activity.fromActivities[0].possibleAnswers,
							splittedString: activity.fromActivities[0].splittedString,
							comment: activity.fromActivities[0].comment,
							fullString: activity.fromActivities[0].fullString
				})

			})
			const newUser = await user.save()
			res.status(200).json(result)


		})
	} catch (err) {
		return handleError(err, res)
	}
})

// 	GET	/api/activities/mistakes
app.get('/selection', required, async (req, res) => {

	/*const test = [];

	return res.status(200).json(test)*/
	
	var result = []

	try {

		const fetchedActivities = await activities.findSelectionActivities(req.user._id)

		User.findById({_id: req.user._id}, async function(err, user){

			if (err) {
				console.log(err)
				return handleError(err, res)
			}

			fetchedActivities.forEach(async function(activity, index) {
				// statements
				//Para cada actividad en fetchedactivities debo marcarlas como taken
				//y debo crear el objeto con todos los datos para devolver al client

				var subDoc = user.activities.id(activity.activities._id);
			  	//console.log(`Subdocument: ${subDoc}`)
				subDoc.set({taken: true})

				result.push({
							activity: activity.activities.activity,
							difficulty: activity.activities.difficulty,
							lastAttempt: activity.activities.lastAttempt,
							reviewInterval: activity.activities.reviewInterval,
							percentOverDue: activity.activities.percentOverDue,
							correctCount: activity.activities.correctCount,
			    			incorrectCount: activity.activities.incorrectCount,
			    			lastAnswer: activity.activities.lastAnswer,
			    			_id: activity.activities._id,
							type: activity.activities.type,
							correctAnswer: activity.fromActivities[0].correctAnswer,
							possibleAnswers: activity.fromActivities[0].possibleAnswers,
							splittedString: activity.fromActivities[0].splittedString,
							comment: activity.fromActivities[0].comment,
							fullString: activity.fromActivities[0].fullString
				})

			})
			const newUser = await user.save()
			console.log(`New User ${newUser}`)
			console.log('Result')
			console.log(result)
			res.status(200).json(result)


		})
	} catch (err) {
		handleError(err, res)
	}
})

//	GET	/api/activities/:id
app.get('/:id', adminRequired, async (req, res) => {

	try{
		const activity = await activities.findActivityById(req.params.id)
		res.status(200).json(activity)
		//res.status(200).json({})

	} catch (err) {
		console.log('Catch del route')
		return handleError(err, res)
	}

})

app.post('/updateActivities', required, async (req, res) => {

	console.log('ENTRANDO AL UPDATE')

	//activities to update
	const toUpdate = req.body


	User.findById({_id:req.user._id}, async function(err, user){
		if (err){
			console.log(err)
			return handleError(err, res)
		} else {
			toUpdate.forEach(async function(activity, index) {
				
				var subDoc = user.activities.id(activity._id);
		  		console.log(`Subdocument: ${subDoc}`)

		  		if(!subDoc.modified){
					console.log('No se ha modificado')

					subDoc.set({
						difficulty: activity.difficulty,
						lastAttempt: activity.lastAttempt,
						reviewInterval: activity.reviewInterval,
						percentOverDue: activity.percentOverDue,
						correctCount: activity.correctCount,
						incorrectCount: activity.incorrectCount,
						lastAnswer: activity.lastAnswer,
						taken: false
					})

					try {
						//const savedActivity = await activities.updateUserActivities(req.user._id, activity)
						const savedActivity = await user.save()
						console.log(savedActivity)
						console.log(`Resultado del query ${savedActivity}`)
					} catch (err){
						//console.log(err)
						errors++
						return handleError(err, res)
					}

				} else {
				  	console.log('Se modificó')
				  	//subDoc.set(req.body);
				  	subDoc.set({modified: false, taken: false})

				  	try {
						const savedActivity = await user.save()
						console.log(savedActivity)
						console.log(`Resultado del query ${savedActivity}`)
					} catch (err){
						//console.log(err)
						errors++
						handleError(err, res)
					}
				}

			});
		}
	})

	res.status(201).json({message: 'Actualización de actividades se ha realizado de manera exitosa'})
})

/*app.post('/updateLostActivities', required, async (req, res) => {

	console.log('Llegué a LOST activities')

	User.findById({_id:req.user._id}, async function(err, user){
		if (err){
			console.log(err)
			return handleError(err, res)
		} else {
			console.log('USER EN LOST:')
			console.log(user)
			user.activities.forEach(async function(activity, index) {
				
				if (activity.modified||activity.taken){

					console.log('Se modificó')
					var subDoc = user.activities.id(activity._id);
				  	//subDoc.set(req.body);
				  	subDoc.set({modified: false, taken: false})

				  	try {
						const savedActivity = await user.save()
						//console.log(savedActivity)
						console.log(`Resultado del query ${savedActivity}`)
					} catch (err){
						console.log(err)
						errors++
						handleError(err, res)
					}

				}
			});
			console.log('Saliendo de LOST activities')
			res.status(201).json({message: 'Actualización de actividades se ha realizado de manera exitosa'})
		}
	})
})*/

//	POST  /api/simpleSelection
//app.post('/', required, async (req, res) => {
app.post('/newSelectionActivity', adminRequired, async (req, res) => {
	console.log('Llegó a la ruta del server');

	const {difficulty, type, comment, fullString, splittedString, correctAnswer, possibleAnswers } = req.body
	const activity = {
		difficulty,
		type,
		comment,
		fullString,
		splittedString,
		correctAnswer,
		possibleAnswers,
		createdAt: moment().utc().toDate()
		//user: req.user._id
	}

	try {
		
		const savedActivity = await activities.createActivity(activity)
		try {
			
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
app.post('/newMistakeActivity', adminRequired, async (req, res) => {

	console.log('Llegó a la ruta del server');

	const {difficulty, type, comment, fullString, splittedString, correctAnswer, possibleAnswers } = req.body
	const activity = {
		difficulty,
		type,
		comment,
		fullString,
		splittedString,
		correctAnswer,
		possibleAnswers,
		createdAt: moment().utc().toDate()
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
app.post('/updateActivity', adminRequired, async (req, res) => {

	const {difficulty, type, comment, fullString, splittedString, correctAnswer, possibleAnswers, createdAt, _id } = req.body
	const activity = {
		difficulty,
		type,
		comment,
		fullString,
		splittedString,
		correctAnswer,
		possibleAnswers,
		createdAt: moment().utc().toDate(),
		_id
		//user: req.user._id
	}

	try {
		
		const updatedActivity = await activities.updateActivity(activity)
		if(updatedActivity){
			try {
				const users = await User.find({})
				if(users.length>0){
					try {

						users.forEach(function(user, index) {
							user.activities.forEach(async function(activity, index) {

								if(activity.activity.equals(updatedActivity._id)){
									if (activity.taken){
										const update = await activities.updateUsersTakenActivity(user._id, updatedActivity)
										
									} else {

										const update = await activities.updateUsersActivity(user._id, updatedActivity)
										
									}
								}
							});
						});


						//const test = await activities.updateUsersActivity(updated)
						res.status(201).json({message: 'Se ha actualizado la actividad exitosamente'})

					} catch(err) {
						// statements
						console.log(err)
						return handleError(err, res)
					}
					
				} else{
					res.status(500).json({
						message: 'Ha ocurrido un error al actualizar la actividad. Contacte al profesor'
					})
				}
			} catch (err) {
				console.log(err)
				return handleError(err, res)
			}
			
		} else {
			res.status(500).json({
				message: 'Ha ocurrido un error al actualizar la actividad. Contacte al profesor'
			})
		}
	} catch (err){
		console.log(err)
		return handleError(err, res)
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