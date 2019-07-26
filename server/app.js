import express from 'express'
import bodyParser from 'body-parser'
import { auth, activities, admin, profile } from './routes'

const app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true})) 

app.use((req, res, next) => {
	console.log('Dirname: ', __dirname);
	
	res.setHeader('Access-Control-Allow-Origin', '*');		//cualquier dominio pueda acceder
	res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Request-With, Content-Type, Accept');	//con cualquiera de estos headers se pueda devolver algo
	res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE, OPTIONS');		//con cualquiera de estos metodos se pueda servir la respuesta
	next();
})

app.use(express.static(__dirname + '/public/files'));
app.use('/public/files', express.static(__dirname + '/public/files'));

// if(process.env.NODE_ENV === 'development') {
// 	app.use((req, res, next) => {
// 		res.setHeader('Access-Control-Allow-Origin', '*');		//cualquier dominio pueda acceder
// 		res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Request-With, Content-Type, Accept');	//con cualquiera de estos headers se pueda devolver algo
// 		res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE, OPTIONS');		//con cualquiera de estos metodos se pueda servir la respuesta
// 		next();
// 	})
// }



app.use('/api/activities', activities)

app.use('/api/admin', admin)

app.use('/api/auth', auth)

app.use('/api/profile', profile)

export default app