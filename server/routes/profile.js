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

	try{
		const data = await activities.prueba(req.user._id)
		console.log(data)
		res.status(200).json(data)

	} catch (err) {
		handleError(err, res)
	}

})


// Aqui van las rutas
export default app