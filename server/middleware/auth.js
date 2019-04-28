import Debug from 'debug'
import { secret } from '../config'
import jwt from 'jsonwebtoken'
import { User } from '../models'


const debug = Debug('acentos:auth-middleware')

export const required = (req, res, next) => {
	
	jwt.verify(req.query.token, secret, (err, token) => {
		if(err){
			return res.status(401).json({
				message: 'Sin autorización',
				error: err
			})
		}

		User.findOne({ _id: token.user._id }, async function(err, user){
			
			if(user&&!user.modified){
				req.user = token.user
				next()
			 	
			} else if(user&&user.modified){

				user.set({modified: false})
				
				try {
					const modifiedUser = await user.save()
					return res.status(401).json({
						message: 'Sin autorización',
						error: {error: 'Usuario modificado', message: 'Contacta al profesor para más información', name: 'User has been modified' },
						token: req.query.token,
						userId: modifiedUser._id,
						firstName: modifiedUser.firstName,
						lastName: modifiedUser.lastName,
						userName: modifiedUser.userName,
						school: modifiedUser.school,
						grade: modifiedUser.grade

					})
				} catch(error) {
					return res.status(401).json({
						message: 'Sin autorización',
						error: error
					})

				}

			 	
			} else {

				//err es null si no consigue nada

				return res.status(401).json({
					message: 'Sin autorización',
					error: {error: 'Usuario no disponible', message: 'Contacta al profesor', name: 'User no longer available' }
				})
			}
		})

	})
}