import express from 'express'
import moment from 'moment';
import { required, adminRequired } from '../middleware'
import { activities} from '../db-api'
import { handleError } from '../utils'
import { User } from '../models'


const app = express.Router()

// 	GET	/api/activities/mistakes
app.get('/mistakes', required, async (req, res) => {

		
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

		
	var result = []

	try {

		const fetchedActivities = await activities.findSelectionActivities(req.user._id)

		User.findById({_id: req.user._id}, async function(err, user){

			if (err) {
				console.log(err)
				return handleError(err, res)
			}

			fetchedActivities.forEach(async function(activity, index) {
				
				
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
		handleError(err, res)
	}
})

//	GET	/api/activities/:id
app.get('/:id', adminRequired, async (req, res) => {

	try{
		const activity = await activities.findActivityById(req.params.id)
		res.status(200).json(activity)

	} catch (err) {
		return handleError(err, res)
	}

})

app.post('/updateActivities', required, async (req, res) => {

	
	//activities to update
	const toUpdate = req.body


	User.findById({_id:req.user._id}, async function(err, user){
		if (err){
			console.log(err)
			return handleError(err, res)
		} else {
			toUpdate.forEach(async function(activity, index) {
				
				var subDoc = user.activities.id(activity._id);

		  		if(!subDoc.modified){

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
						const savedActivity = await user.save()
					} catch (err){
						errors++
						return handleError(err, res)
					}

				} else {
				  	subDoc.set({modified: false, taken: false})

				  	try {
						const savedActivity = await user.save()
					} catch (err){
						errors++
						handleError(err, res)
					}
				}

			});
		}
	})

	res.status(201).json({message: 'Actualización de actividades se ha realizado de manera exitosa'})
})

app.post('/newSelectionActivity', adminRequired, async (req, res) => {
	
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
app.post('/newMistakeActivity', adminRequired, async (req, res) => {

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


						
						res.status(201).json({message: 'Se ha actualizado la actividad exitosamente'})

					} catch(err) {
						
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



export default app