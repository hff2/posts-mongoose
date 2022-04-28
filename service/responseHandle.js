const { HEADERS } = require('./constant')

const successHandle = (res, statusCode, posts) => {
    res.writeHead(statusCode, HEADERS)
    res.write(JSON.stringify({
        status: 200,
        data: posts
    }))
    res.end()
}

const errorHandle = (res, statusCode, message) => {
    res.writeHead(statusCode, HEADERS)
    res.write(JSON.stringify({
        status: 'false',
        message
    }))
    res.end()
}

module.exports = {
    successHandle,
    errorHandle
}