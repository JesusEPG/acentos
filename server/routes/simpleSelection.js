import express from 'express'
import { required, simpleSelectionActivityMiddleware } from '../middleware'
import { simpleSelection } from '../db-api'
import { handleError } from '../utils'
import { User } from '../models'


const app = express.Router()


//Estas rutas son un agregado a la ruta definida en app.js

// 	GET	/api/questions
/*app.get('/', async (req, res) => {

	try {
		const simpleSelectionActivities = await simpleSelection.findAll()
		res.status(200).json(simpleSelectionActivities)
	} catch (err) {
		handleError(err, res)
	}
})*/


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
app.post('/', async (req, res) => {

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
		const savedActivity = await simpleSelection.create(activity)
		console.log(savedActivity._id)
		try {
			//Hacer que updateUsers sea una promesa para poder validar errores
			const test = await simpleSelection.updateUsers(savedActivity._id, savedActivity.difficulty)
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