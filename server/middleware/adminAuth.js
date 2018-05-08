import Debug from 'debug'
import { secret } from '../config'
import jwt from 'jsonwebtoken'
import { User } from '../models'


const debug = Debug('acentos:adminAuth-middleware')

export const adminRequired = (req, res, next) => {
	jwt.verify(req.query.token, secret, (err, token) => {
		if(err){
			debug('JWT was not encrypted with our secret')
			return res.status(401).json({
				message: 'Unauthorized',
				error: err
			})
		}

		User.findOne({ _id: token.user._id }, function(err, user){
			
			if(user){
				debug(`Token verified ${token}`)
				debug(token)
				req.user = token.user
				next()
				
			} else {

				console.log(err)

				/*err es null si no consigue nada*/

				return res.status(401).json({
					message: 'Unauthorized',
					error: 'Usuario no disponible. Contactar al profesor'
				})
			}
		})

	})
}