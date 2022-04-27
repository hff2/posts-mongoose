const http = require('http')
const { HEADERS, REQUEST_METHOD } = require('./constant')
const { successHandle, errorHandle } = require('./responseHandle')
const dotenv = require('dotenv')
const Post = require('./models/post')
const mongoose = require('mongoose');

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace(
    '<password>', process.env.DATABASE_PASSWORD
)
mongoose
    .connect(DB)
    .then(() => console.log('資料庫連接成功'))
    .catch((error) => {
        console.log(error);
    })

const requestListener = async (req, res) => {
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
    if (req.url === '/posts' && req.method === REQUEST_METHOD.GET) {
        const post = await Post.find();
        successHandle(res, post)
    }
    /* POST */
    else if (req.url === '/posts' && req.method === REQUEST_METHOD.POST) {
        req.on('end', async () => {
            try {
                const data = JSON.parse(body)
                const content = data?.content ?? undefined

                if (content !== undefined) {
                    const newPost = await Post.create(
                        {
                            name: data.name,
                            content: data.content,
                        }
                    );
                    successHandle(res, newPost)
                }
                else {
                    errorHandle(res, 400, '資料不齊全')
                }
            }
            catch {
                errorHandle(res, 400, '建立失敗')
            }
        })
    }
    /* DELETE ALL */
    else if (req.url === '/posts' && req.method === 'DELETE') {
        await Post.deleteMany({});
        successHandle(res, '刪除所有資料成功');
    }
    /* DELETE ONE */
    else if (req.url.startsWith("/posts/") && req.method === "DELETE") {
        try {
            const postId = req.url.split('/').pop();
            await Post.findByIdAndDelete(postId);
            successHandle(res, '刪除資料成功');
        } catch {
            errorHandle(res, '刪除資料失敗或無此 ID');
        }
    }
    /* PATCH */
    else if (req.url.startsWith('/posts/') && req.method === 'PATCH') {
        req.on('end', async () => {
            try {
                const postId = req.url.split('/').pop();
                const data = JSON.parse(body);
                await Post.findByIdAndUpdate(postId, {
                    content: data.content
                });
                successHandle(res, '修改資料成功')
            } catch {
                errorHandle(res, '修改資料失敗，欄位名稱不正確或無此 ID');
            }
        })
    }
    /* OPTIONS */
    else if (req.method === "OPTIONS") {
        successHandle(200, HEADERS)
    }
    else {
        res.writeHead(404, HEADERS);
        res.write(JSON.stringify({
            "status": "false",
            "message": "無此網站路由"
        }));
        res.end();
    }
}

const server = http.createServer(requestListener)
// server.listen(process.env.PORT)
server.listen(3005)