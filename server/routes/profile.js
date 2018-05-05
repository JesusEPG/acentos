import express from 'express'
import { required, simpleSelectionActivityMiddleware } from '../middleware'
import { activities} from '../db-api'
import { handleError } from '../utils'
import { User, Activity } from '../models'
import moment from 'moment';


const app = express.Router()


//Estas rutas son un agregado a la ruta definida en app.js

// 	GET	/api/admin/users
app.get('/users', async (req, res) => {

	User.find({}, function(err, users){
		if(err){
			console.log(err)
			handleError(err, res)
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
			handleError(err, res)
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
/*app.get('/activities', async (req, res) => {

	try {

		const result = await activities.findAllActivities()
		res.status(200).json(result)
		
	} catch(err) {
		// statements
		console.log(err);
		handleError(err, res)
	}
})*/




//	GET	/api/profile
app.get('/', required, async (req, res) => {

	/*const dateJs = new Date()
	console.log(dateJs)

	const dateTest = moment(dateJs).utc().format()
	console.log(dateTest)*/

	let dates = generateDate(30, 'minutes')

	console.log(dates)

	try{
		const data = await activities.prueba(req.user._id, dates.pastDate)
		console.log(data)
		res.status(200).json(data)

	} catch (err) {
		handleError(err, res)
	}

})

function generateDate(number, period){

	let currentDate = moment().utc()
	let pastDate = moment(currentDate).utc().subtract(number, period)

	let test = {
		currentDate: currentDate.toDate(),
		pastDate: pastDate.toDate()
	}

	console.log(test)

	return test
}


// Aqui van las rutas
export default app