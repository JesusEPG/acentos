export const handleError = (error, res) => {
	//console.log(error)
	res.status(500).json({
		message: 'Ha ocurrido un error. Contacte al profesor',
		error
	})
}

export const handleNewError = (error, res, status, message) => {
	//console.log(error)
	res.status(status).json({
		message: message,
		error
	})
}