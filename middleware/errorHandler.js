function errorHandler(err, req, res, next) {
  console.log('There was an error')
  console.log(err.name)
  console.log(err)

  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid parameter given' })
  }
  if (err.name === 'NotFound') {
    return res.sendStatus(404).json({ message: 'Not Found' })
  }
  if (err.name === 'NotValid') {
    return res
      .status(400)
      .json({ message: 'There was an error, Details provided are not valid' })
  }

  // // TODO follow up on the logic of the validation errors
  // TODO usage of key as a key ?
  // ? loop through each err.error message, place on our new errrors object
  // ? return the error messages as the response to the API request
  if (err.name === 'ValidationError') {
    const errors = {}
    for (const key in err.errors) {
      errors[key] = err.errors[key].message
    }
    return res.status(422).json({
      message: 'Form Validation Error',
      errors,
    })

  }
  // ? internal server error
  res.sendStatus(500)
  next(err)
}

export default errorHandler
