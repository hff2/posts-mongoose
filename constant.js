const HEADERS = {
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
    'Content-Type': 'application/json'
}

// Object.freeze，就是「凍結」一個物件的意思，可以防止物件新增屬性或是既有的屬性被刪除。
const REQUEST_METHOD = Object.freeze({
    GET: 'GET',
    POST: 'POST',
    DELETE: 'DELETE',
    OPTION: 'OPTION',
})

module.exports = {
    HEADERS,
    REQUEST_METHOD
}