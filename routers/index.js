const { HEADERS, REQUEST_METHOD } = require('../service/constant')
const { successHandle, errorHandle } = require('../service/responseHandle')

const httpControllers = require('../controllers/http')
const postsControllers = require('../controllers/posts')

const routes = async (req, res) => {
    const { url, method } = req;

    let body = "";
    try {
        await new Promise((resolve, reject) => {
            req
                .on('data', chunk => body += chunk)
                .on('end', () => resolve())
                .on('error', e => reject(e))
        })
    }
    catch (e) {
        console.error(e)
        errorHandle(res, 400, '執行錯誤')
    }

    /* GET */
    if (url === '/posts' && method === REQUEST_METHOD.GET) {
        postsControllers.getPosts({ req, res })
    }
    /* POST */
    else if (url === '/posts' && method === REQUEST_METHOD.POST) {
        postsControllers.createPosts({ body, req, res })
    }
    /* DELETE ALL */
    else if (url === '/posts' && method === REQUEST_METHOD.DELETE) {
        postsControllers.deleteAllPosts({ req, res })
    }
    /* DELETE ONE */
    else if (url.startsWith("/posts/") && method === REQUEST_METHOD.DELETE) {
        postsControllers.deleteOnePost({ req, res })
    }
    /* PATCH */
    else if (url.startsWith('/posts/') && method === REQUEST_METHOD.PATCH) {
        postsControllers.patchPosts({ body, req, res })
    }
    /* OPTIONS */
    else if (method === REQUEST_METHOD.OPTIONS) {
        httpControllers.cors(req, res)
    } else {
        httpControllers.notFound(req, res)
    }
}

module.exports = routes;