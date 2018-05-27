import Debug from 'debug'
import { secret } from '../config'
import jwt from 'jsonwebtoken'
import { User } from '../models'


const debug = Debug('acentos:auth-middleware')

export const required = (req, res, next) => {
	
	jwt.verify(req.query.token, secret, (err, token) => {
		console.log('Token: ')
		console.log(token)
		if(err){
			debug('JWT was not encrypted with our secret')
			return res.status(401).json({
				message: 'Unauthorized',
				error: err
			})
		}

		/*User.findOne({ _id: token.user._id }, function(err, user){
			
			if(user){
				debug(`Token verified ${token}`)
				debug(token)
				req.user = token.user
				next()
				
			} else {

				console.log(err)

				//err es null si no consigue nada

				return res.status(401).json({
					message: 'Sin autorización',
					error: {error: 'Usuario no disponible', message: 'Contactar al profesor', name: 'User no longer available' }
				})
			}
		})*/

		User.findOne({ _id: token.user._id }, async function(err, user){
			
			if(user&&!user.modified){
				debug(`Token verified ${token}`)
				//debug(token)
				req.user = token.user
				next()
			 	
			} else if(user&&user.modified){

				user.set({modified: false})
				
				try {
					const modifiedUser = await user.save()

					return res.status(401).json({
						message: 'Sin autorización',
						error: {error: 'Usuario modificado', message: 'Contactar al profesor', name: 'User has been modified' },
						token: req.query.token,
						userId: modifiedUser._id,
						firstName: modifiedUser.firstName,
						lastName: modifiedUser.lastName,
						userName: modifiedUser.userName

					})
				} catch(error) {
					// statements
					console.log(error);
				}

			 	
			} else {

				console.log(err)

				//err es null si no consigue nada

				return res.status(401).json({
					message: 'Sin autorización',
					error: {error: 'Usuario no disponible', message: 'Contactar al profesor', name: 'User no longer available' }
				})
			}
		})

	})
}