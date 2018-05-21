import express from 'express'
import jwt from 'jsonwebtoken'
import { secret } from '../config'
import { User, Admin } from '../models'
import Debug from 'debug'
import { activities } from '../db-api'
import { handleError } from '../utils'

import {
	hashSync as hash,
	compareSync as comparePasswords
} from 'bcryptjs'

const debug = Debug('acentos:auth-routes')


const app = express.Router()

app.post('/signin', async (req, res, next) => {

	const { userName, password } = req.body
	const user = await User.findOne({ userName }) //busca el que tenga ese userName

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

	console.log(user._id)

	//const prueba = await activities.prueba(user._id)
	//console.log(prueba)

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

app.post('/adminSignin', async (req, res, next) => {
	const { email, password } = req.body
	const admin = await Admin.findOne({ email }) //busca el que tenga ese email
	//El usuario no existe
	if(!admin){
		debug(`Admin with email ${email} not found`)
		return handleLoginFailed(res, 'No se encontró el email')
	}

	//La contraseña ingresada es invalida
	if(!comparePasswords(password, admin.password)){
		debug(`Password ${password} does not match`)
		return handleLoginFailed(res, 'La contraseña no coincide')
	}

	//Las credenciales son correctas
	const adminToken = createToken(admin)
	
	//Se envía el usuario desglosado para no envíar la contraseña plana
	res.status(200).json({
		message: 'Login succeded',
		adminToken,
		userId: admin._id,
		firstName: admin.firstName,
		lastName: admin.lastName,
		email: admin.email,
		role: admin.role
	})

})

app.post('/signup', async (req, res) => {

	let newActivities = []

	const { firstName, lastName, userName, password } = req.body
	
	//VALIDAR QUE EL USUARIO NO EXISTa

	//Esto será selection activities
	//Un for each para cada tipo de ejercicio
	//Cada ejercicio estará en colecciones distintas
	const result = await activities.findAllActivities()

	result.forEach(function(activity){
		
		newActivities.push({ 
					activity: activity._id,
					type: activity.type,
					difficulty: activity.difficulty,
					percentOverDue: 1,
					reviewInterval: 1,
					lastAttempt: null,
					correctCount: 0,
    				incorrectCount: 0,
    				lastAnswer: null
				})
	})

	const u = new User({
		firstName,
		lastName,
		userName,
		password: hash(password, 10),
		modified: false,
		activities: newActivities
	})

	//const newUser = await u.save()
	u.save(function (err, newUser) {
	    if (err){
	    	console.log(err)
	    	return handleError(err, res)
	    	/*return res.status(401).json({
				message:'Ha ocurrido un error al crear el usuario',
				error: err
			})*/
	    } 

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
		message:`Inicio de sesión fallido. ${msg}`,
		error: msg
	})
}

//El primer parametro de sign es la info del usuario, el segundo la clave con la que se va a encriptar la info
//Y el tercer parametro son opciones de como se generará la encriptación
const createToken = (user) => jwt.sign({ user }, secret, /*{ expiresIn: 86400}*/{ expiresIn: 6000})

export default app