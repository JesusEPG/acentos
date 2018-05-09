export const handleError = (error, res) => {
	res.status(500).json({
		message: 'Ha ocurrido un error',
		error
	})
}