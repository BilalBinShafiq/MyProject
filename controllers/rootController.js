exports.getROot = (request, response) => {
    response
        .status(200)
        .json({ message: 'Hello from the root!', app: 'MyApp' })
}

exports.postRoot = (request, response) => {
    response.send('You can post to this root endpoint...')
}