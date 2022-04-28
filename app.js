const routes = require('./routers')

require('./connections')

const requestListener = async (req, res) => {
    routes(req, res)
}

module.exports = requestListener;