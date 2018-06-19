import Debug from 'debug'
import { secret } from '../config'
import jwt from 'jsonwebtoken'
import { Admin } from '../models'

export const adminRequired = (req, res, next) => {
	jwt.verify(req.query.token, secret, (err, token) => {
		if(err){
			return res.status(401).json({
				message: 'Sin autorización',
				error: err
			})
		}
		Admin.findOne({ _id: token.user._id }, function(err, user){
			console.log(`User found ${user}`)
			if(user){
				console.log(`Token verified ${token}`)
				req.user = token.user
				next()
				
			} else {

				return res.status(401).json({
					message: 'Sin autorización',
					error: 'Usuario no disponible. Contacta al encargado del sistema'
				})
			}
		})

	})
}