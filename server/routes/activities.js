import express from 'express'
import { required, simpleSelectionActivityMiddleware } from '../middleware'
import { activities} from '../db-api'
import { handleError } from '../utils'
import { User } from '../models'


const app = express.Router()


//Estas rutas son un agregado a la ruta definida en app.js

// 	GET	/api/activities
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
				correctAnswer: activity.fromActivities[0].correctAnswer,
				possibleAnswers: activity.fromActivities[0].possibleAnswers,
				splittedString: activity.fromActivities[0].splittedString,
				comment: activity.fromActivities[0].comment,
				fullString: activity.fromActivities[0].fullString,
				lastAttempt: activity.activities.lastAttempt,
				reviewInterval: activity.activities.reviewInterval,
				percentOverDue: activity.activities.percentOverDue 
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
app.post('/simpleSelection', async (req, res) => {

	console.log('Llegó a la ruta del server');

	const {difficulty, comment, fullString, splittedString, correctAnswer, possibleAnswers, createdAt } = req.body
	const activity = {
		difficulty,
		comment,
		fullString,
		splittedString,
		correctAnswer,
		possibleAnswers,
		createdAt
		//user: req.user._id
	}

	try {
		const savedActivity = await activities.create(activity)
		console.log(savedActivity._id)
		try {
			//Hacer que updateUsers sea una promesa para poder validar errores
			const test = await activities.updateUsers(savedActivity._id, savedActivity.difficulty)
			console.log(`Testing ${test}`)
			console.log(test)
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