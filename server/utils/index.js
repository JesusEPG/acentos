export const handleError = (error, res) => {
	//console.log(error)
	res.status(500).json({
		message: 'Ha ocurrido un error. Contacte al profesor',
		error
	})
}