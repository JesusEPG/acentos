import express from 'express'
import bodyParser from 'body-parser'
import { auth } from './routes'

const app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true})) //Para que lea cosas en formato UTF8

if(process.env.NODE_ENV === 'development') {		//indica en que entorno estamos
	app.use((req, res, next) => {
		res.setHeader('Access-Control-Allow-Origin', '*');		//cualquier dominio pueda acceder
		res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Request-With, Content-Type, Accept');	//con cualquiera de estos headers se pueda devolver algo
		res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE, OPTIONS');		//con cualquiera de estos metodos se pueda servir la respuesta
		next();
	})
}


//question se encargará de decidir que va a devolver
// se usa 'use' porque se pueden manejar distintos tipos de request, y es cuestion donde define cada tipo
//app.use('/api/questions', question)

app.use('/api/auth', auth)

//app.get('/', (req, res) => res.send('Hola desde el servidor'))



export default app