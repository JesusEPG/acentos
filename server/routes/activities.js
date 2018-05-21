import express from 'express'
import moment from 'moment';
import { required, simpleSelectionActivityMiddleware } from '../middleware'
import { activities} from '../db-api'
import { handleError } from '../utils'
import { User } from '../models'


const app = express.Router()


//Estas rutas son un agregado a la ruta definida en app.js

// 	GET	/api/activities/selection
/*app.get('/selection', required, async (req, res) => {

	try {

		const fetchedActivities = await activities.findMistakesActivities(req.user._id)
		
		fetchedActivities.forEach( async function(activity, index) {
		
			User.findById({_id: req.user._id}, async function(err, user) {
				if (err){
					console.log(err)
					handleError(err, res)
				}
				console.log(`User: ${user}`)
			  	var subDoc = user.activities.id(activity.activities._id);
			  	console.log(`Subdocument: ${subDoc}`)
				subDoc.set({taken: true})

				try {
					const savedActivity = await user.save()
					console.log(savedActivity)
					console.log(`Resultado del query-taken ${savedActivity}`)
					let result = fetchedActivities.map(function(activity, index){
						return {
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
						}
					})
					res.status(200).json(result)
				} catch (err){
						console.log(err)
						handleError(err, res)
				}
			})

		})
	} catch (err) {
		handleError(err, res)
	}
})*/

// 	GET	/api/activities/mistakes
app.get('/mistakes', required, async (req, res) => {

	/*const test = [];

	return res.status(200).json(test)*/
	
	var result = []

	try {

		//Obtengo las actividades
		const fetchedActivities = await activities.findMistakesActivities(req.user._id)

		//Para cada actividad en fetchedactivities debo marcarlas como taken
		//y debo crear el objeto con todos los datos para devolver al client

		console.log('Fetched: ')
		console.log(fetchedActivities)


		User.findById({_id: req.user._id}, async function(err, user){

			if (err) {
				console.log(err)
				handleError(err, res)
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

// 	GET	/api/activities/mistakes
app.get('/selection', required, async (req, res) => {

	/*const test = [];

	return res.status(200).json(test)*/
	
	var result = []

	try {

		//Obtengo las actividades
		const fetchedActivities = await activities.findSelectionActivities(req.user._id)

		//Para cada actividad en fetchedactivities debo marcarlas como taken
		//y debo crear el objeto con todos los datos para devolver al client

		console.log('Fetched: ')
		console.log(fetchedActivities)


		User.findById({_id: req.user._id}, async function(err, user){

			if (err) {
				console.log(err)
				handleError(err, res)
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


//	GET	/api/questions/:id
/*app.get('/:id', simpleSelectionActivityMiddleware, async (req, res) => {

	try{
		res.status(200).json(req.simpleSelectionActivity)

	} catch (err) {
		handleError(err, res)
	}

})*/

//para traer actividades
/*app.get('/', required, async (req, res) => {

	try {

		const fetchedActivities = await activities.findMistakesActivities(req.user._id)
		
		fetchedActivities.forEach( async function(activity, index) {
		
			User.findById({_id: req.user._id}, async function(err, user) {
				if (err){
					console.log(err)
					handleError(err, res)
				}
				console.log(`User: ${user}`)
			  	var subDoc = user.activities.id(activity.activities._id);
			  	console.log(`Subdocument: ${subDoc}`)
				subDoc.set({taken: true})

				try {
					const savedActivity = await user.save()
					console.log(savedActivity)
					console.log(`Resultado del query-taken ${savedActivity}`)
					let result = fetchedActivities.map(function(activity, index){
						return {
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
						}
					})
					res.status(200).json(result)
				} catch (err){
						console.log(err)
						handleError(err, res)
				}
			})

		})
	} catch (err) {
		handleError(err, res)
	}
})*/

//	GET	/api/activities/:id
app.get('/:id', async (req, res) => {

	try{
		const activity = await activities.findActivityById(req.params.id)
		res.status(200).json(activity)
		//res.status(200).json({})

	} catch (err) {
		console.log('Catch del route')
		return handleError(err, res)
	}

})

//	POST  /api/simpleSelection
//app.post('/', required, async (req, res) => {
app.post('/updateActivities', required, async (req, res) => {

	const toUpdate = req.body
	let errors = 0

	//console.log(toUpdate)

	toUpdate.forEach( async function(activity, index) {
		console.log(activity)
		// statements
		/*User.findOne({_id: req.user._id, "activities.activity": activity.activity}, function(err, subdoc){
			if(err) console.log('Error')

			console.log('Probando subdoc')
			console.log(subdoc)
		})*/

		User.findById({_id:req.user._id}, async function(err, user) {
			if (err){
				console.log(err)
				handleError(err, res)
			}
			console.log(`User: ${user}`)
		  	var subDoc = user.activities.id(activity._id);
		  	console.log(`Subdocument: ${subDoc}`)

			if(!subDoc.modified){
				console.log('No modificó')
			  	//setear a false el campo modified y se debe enviar junto con la actividad
			  	try {
					const savedActivity = await activities.updateUserActivities(req.user._id, activity)
					console.log(savedActivity)
					console.log(`Resultado del query ${savedActivity}`)
				} catch (err){
					//console.log(err)
					errors++
					handleError(err, res)
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

	})

	console.log(errors)

	res.status(201).json({message: 'Todo Bien'})
})

//	POST  /api/simpleSelection
//app.post('/', required, async (req, res) => {
app.post('/newSelectionActivity', async (req, res) => {

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
app.post('/newMistakeActivity', async (req, res) => {

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
/*app.post('/updateMistakeActivity', async (req, res) => {

	const {difficulty, type, comment, fullString, splittedString, correctAnswer, possibleAnswers, createdAt, _id } = req.body
	const activity = {
		difficulty,
		type,
		comment,
		fullString,
		splittedString,
		correctAnswer,
		possibleAnswers,
		createdAt,
		_id
		//user: req.user._id
	}

	try {
		//El db api debe ser solo de selection
		
		const updatedActivity = await activities.updateActivity(activity)
		console.log(updatedActivity)
		try {
			//Hacer que updateUsers sea una promesa para poder validar errores
			const users = await User.find({})
			try {
				// statements

				users.forEach(function(user, index) {
					user.activities.forEach(async function(activity, index) {

						if(activity.activity.equals(updatedActivity._id)){
							//esta es la actividad en activities de user
							//modifico
							//if (dificultaded no cambió)
							console.log('Es igual!!!')
							const prueba = await activities.prueba(user._id, updatedActivity)
							console.log(prueba)
							//activities.prueba(user._id, updatedActivity)
							//activity.difficulty= updatedActivity.difficulty,
							//activity.lastAttempt = updatedActivity.lastAttempt,
							//activity.reviewInterval = updatedActivity.reviewInterval,
							//activity.percentOverDue = updatedActivity.percentOverDue
						}
					});
					//User.save(user)
				});


				//const test = await activities.updateUsersActivity(updated)
				res.status(201).json({message: 'Actualización exitosa'})

			} catch(err) {
				// statements
				console.log(err)
				handleError(err, res)
			}
		} catch (err) {
			console.log(err)
			handleError(err, res)
		}
	} catch (err){
		console.log(err)
		handleError(err, res)
	}
})*/

//	POST  /api/activities/newMistakeActivity
//app.post('/', required, async (req, res) => {
app.post('/updateActivity', async (req, res) => {

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

	console.log(activity)

	try {
		//El db api debe ser solo de selection
		
		const updatedActivity = await activities.updateActivity(activity)
		console.log('Actualizado: ')
		console.log(updatedActivity)
		try {
			//Hacer que updateUsers sea una promesa para poder validar errores
			const users = await User.find({})
			try {
				// statements

				users.forEach(function(user, index) {
					user.activities.forEach(async function(activity, index) {

						if(activity.activity.equals(updatedActivity._id)){
							//esta es la actividad en activities de user
							//modifico
							if (activity.taken){
								console.log('Fue tomado en sesión')
								const update = await activities.updateUsersTakenActivity(user._id, updatedActivity)
								console.log(update)
							} else {

								console.log('Es igual!!!')
								const update = await activities.updateUsersActivity(user._id, updatedActivity)
								console.log(update)
							}
						}
					});
					//User.save(user)
				});


				//const test = await activities.updateUsersActivity(updated)
				res.status(201).json({message: 'Actualización exitosa'})

			} catch(err) {
				// statements
				console.log(err)
				handleError(err, res)
			}
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