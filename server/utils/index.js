export const handleError = (error, res) => {
	res.status(500).json({
		message: 'An error has ocurred',
		error
	})
}