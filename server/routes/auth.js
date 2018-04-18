import express from 'express'
import jwt from 'jsonwebtoken'
import { secret } from '../config'
import { User } from '../models'
import Debug from 'debug'
import { activities } from '../db-api'

import {
	hashSync as hash,
	compareSync as comparePasswords
} from 'bcryptjs'

const debug = Debug('acentos:auth-routes')


const app = express.Router()

app.post('/signin', async (req, res, next) => {
	const { userName, password } = req.body
	const user = await User.findOne({ userName }) //busca el que tenga ese userName
	console.log(user._id)
	let result = await activities.testQuery(user._id)
	console.log(result)
	console.log(result[0].fromActivities[0])

	//El usuario no existe
	if(!user){
		debug(`User with Username ${userName} not found`)
		return handleLoginFailed(res, 'Username not found')
	}

	//La contraseña ingresada es invalida
	if(!comparePasswords(password, user.password)){
		debug(`Password ${password} does not match`)
		return handleLoginFailed(res, 'Password doesn\'t match')
	}

	//Las credenciales son correctas
	const token = createToken(user)
	
	//Se envía el usuario desglosado para no envíar la contraseña plana
	res.status(200).json({
		message: 'Login succeded',
		token,
		userId: user._id,
		firstName: user.firstName,
		lastName: user.lastName,
		userName: user.userName
	})

})

app.post('/signup', async (req, res) => {

	let newActivities = []

	const { firstName, lastName, userName, password } = req.body
	
	//VALIDAR QUE EL USUARIO NO EXISTa

	const result = await activities.findAll()

	result.map(function(activity){
		newActivities.push({ 
					activity: activity._id,
					difficulty: activity.difficulty,
					percentOverDue: 1,
					reviewInterval: 1,
					lastAttempt: null
				})
	})

	const u = new User({
		firstName,
		lastName,
		userName,
		password: hash(password, 10),
		newActivities
	})
	

	//const newUser = await u.save()
	u.save(function (err, newUser) {
	    if (err) return console.error(err); //Hacer handle error

	    debug(`Creating new user ${newUser}`)
		const token = createToken(newUser)
		res.status(201).json({
			message: 'User saved',
			token,
			userId: newUser._id,
			firstName,
			lastName,
			userName
		})
	  });

})

function handleLoginFailed(res, msg){
	return res.status(401).json({
		message:'Login failed',
		error: msg
	})
}

//El primer parametro de sign es la info del usuario, el segundo la clave con la que se va a encriptar la info
//Y el tercer parametro son opciones de como se generará la encriptación
const createToken = (user) => jwt.sign({ user }, secret, /*{ expiresIn: 86400}*/{ expiresIn: 600})

export default app