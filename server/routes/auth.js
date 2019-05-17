import express from 'express'
import jwt from 'jsonwebtoken'
import { secret } from '../config'
import { User, Admin } from '../models'
import { activities } from '../db-api'
import { handleError, handleNewError } from '../utils'

import {
	hashSync as hash,
	compareSync as comparePasswords
} from 'bcryptjs'

const app = express.Router()

app.post('/signin', async (req, res, next) => {

	const { userName, password } = req.body
	const user = await User.findOne({ userName })

	//El usuario no existe
	if(!user){
		return handleLoginFailed(res, 'Nombre de usuario no encontrado')
	}

	//La contraseña ingresada es invalida
	if(!comparePasswords(password, user.password)){
		return handleLoginFailed(res, 'La contraseña no coincide')
	}

	//Las credenciales son correctas
	const token = createToken(user)
	
	//Se envía el usuario desglosado para no envíar la contraseña plana
	res.status(200).json({
		message: 'Login succeded',
		data: {
			token,
			userId: user._id,
			firstName: user.firstName,
			lastName: user.lastName,
			userName: user.userName,
			grade: user.grade,
			school: user.school
		}
	})
})

app.post('/adminSignin', async (req, res, next) => {
	const { email, password } = req.body
	const admin = await Admin.findOne({ email })
	//El usuario no existe
	if(!admin){
		return handleLoginFailed(res, 'No se encontró el email')
	}

	//La contraseña ingresada es invalida
	if(!comparePasswords(password, admin.password)){
		return handleLoginFailed(res, 'La contraseña no coincide')
	}

	//Las credenciales son correctas
	const adminToken = createToken(admin)
	
	//Se envía el usuario desglosado para no envíar la contraseña
	res.status(200).json({
		message: 'Login succeded',
		data : {
			adminToken,
			userId: admin._id,
			firstName: admin.firstName,
			lastName: admin.lastName,
			email: admin.email,
			role: admin.role
		}
	})
})

app.post('/signup', async (req, res) => {
	
	let newActivities = []
	const { firstName, lastName, userName, password, school, grade } = req.body
	const user = await User.findOne({ userName })

	if(user) {
		handleNewError(
			"Nombre de usuario ya está en uso",
			res, 
			401, 
			'Registro de usuario falló. Nombre de usuario ya está en uso'
		);
	} else {

		//implementar try/catch

		//Se inicializan campos del algoritmo en usuario para cada actividad
		const result = await activities.findAllActivities()

		result.forEach((activity) => {
			
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
			school,
			grade,
			activities: newActivities
		})

		//To create admin in hardcoded way
		const a = new Admin({
			firstName: 'Jesus', 
			lastName: 'Pernia', 
			email: 'jesuse.pg@hotmail.com', 
			role:'admin', 
			password: hash('1234', 10)
		})

		u.save((err, newUser) => {
		    if (err){
		    	console.log(err)
		    	return handleError(err, res)
		    }
			const token = createToken(newUser)

			//To create admin in hardcoded way
			a.save(function (err, newAdminUser) {
				if (err){
					console.log('Error creando admin')
					console.log(err)
					// return handleError(err, res)
				}
				console.log('Admin Creado')
			});

			res.status(201).json({
				message: 'Se ha creado el usuario de exitosamente',
				data: {
					token,
					userId: newUser._id,
					firstName,
					lastName,
					userName,
					grade,
					school
				}
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