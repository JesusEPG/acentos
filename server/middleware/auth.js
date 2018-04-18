import Debug from 'debug'
import { secret } from '../config'
import jwt from 'jsonwebtoken'

const debug = Debug('acentos:auth-middleware')


export const required = (req, res, next) => {
	jwt.verify(req.query.token, secret, (err, token) => {
		if(err){
			debug('JWT was not encrypted with our secret')
			return res.status(401).json({
				message: 'Unauthorized',
				error: err
			})
		}

		debug(`Token verified ${token}`)
		debug(token)
		req.user = token.user
		next()
	})
}