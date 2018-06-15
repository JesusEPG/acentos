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
		return handleLoginFailed(res, 'Nombre de usuario no encontrado')
	}

	//La contraseña ingresada es invalida
	if(!comparePasswords(password, user.password)){
		return handleLoginFailed(res, 'La contraseña no coincide')
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
		userName: user.userName,
		grade: user.grade,
		school: user.school
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

	console.log(req.body)

	const { firstName, lastName, userName, password, school, grade } = req.body
	
	//VALIDAR QUE EL USUARIO NO EXISTA
	const user = await User.findOne({ userName }) //busca el que tenga ese userName

	if(user) {
		return res.status(401).json({
			message:`Registro de usuario falló. Nombre de usuario ya está en uso`,
			error: "Nombre de usuario ya está en uso"
		})
	} else {

		//Inicializar campos del algoritmo en usuario para cada actividad
		const result = await activities.findAllActivities()

		console.log("RESULT:")
		console.log(result)

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

		/*const admin = new Admin({
			"firstName": "Mervin" ,
			"lastName": "Coello",
			"email": "mahonricoello@gmail.com",
			"role": "admin",
			"password": hash("123", 10)
		})
		admin.save(function (err, newUser) {
		    if (err){
		    	console.log(err)
		    	return handleError(err, res)
		    }
		  });*/

		const u = new User({
			firstName,
			lastName,
			userName,
			password: hash(password, 10),
			modified: false,
			school,
			grade,
			activities: newActivities
		})
		u.save(function (err, newUser) {
		    if (err){
		    	console.log(err)
		    	return handleError(err, res)
		    } 

		    debug(`Creating new user ${newUser}`)
			const token = createToken(newUser)
			res.status(201).json({
				message: 'Se ha creado el usuario de exitosamente',
				token,
				userId: newUser._id,
				firstName,
				lastName,
				userName
			})
		  });
	}


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