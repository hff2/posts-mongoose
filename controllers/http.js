const { successHandle, errorHandle } = require('../service/responseHandle')
const { HEADERS } = require('../service/constant')

const httpControllers = {
    cors(req, res) {
        res.writeHead(200, HEADERS)
        res.end()
    },
    notFound(req, res) {
        errorHandle(res, 404, "無此網站路由")
    }
}

module.exports = { httpControllers }