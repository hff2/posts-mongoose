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
        try {
            const post = await Post.find();
            successHandle(res, 200, post)
        }
        catch (e) {
            console.error(e)
            errorHandle(res, 400, '取得 posts 錯誤')
        }
    }
    /* POST */
    else if (req.url === '/posts' && req.method === REQUEST_METHOD.POST) {
        try {
            const data = JSON.parse(body)
            const { name, content } = data

            if (!content || !name) {
                errorHandle(res, 400, '資料不齊全')
                return
            }
            const newPost = await Post.create(
                {
                    name: data.name,
                    content: data.content,
                }
            );
            successHandle(res, 200, newPost)
        }
        catch (e) {
            console.error(e)
            errorHandle(res, 400, '建立 posts 錯誤')
        }
    }
    /* DELETE ALL */
    else if (req.url === '/posts' && req.method === 'DELETE') {
        try {
            await Post.deleteMany({});
            successHandle(res, 200, []);
        }
        catch (e) {
            console.error(e)
            errorHandle(res, 400, '刪除全部 posts 錯誤')
        }
    }
    /* DELETE ONE */
    else if (req.url.startsWith("/posts/") && req.method === "DELETE") {
        try {
            const postId = req.url.split('/').pop();
            const result = await Post.findByIdAndDelete(postId);
            if (!result) {
                errorHandle(res, 400, '無此 Post')
                return
            }
            const posts = await Post.find()
            successHandle(res, 200, posts);

        } catch (e) {
            console.log(e);
            errorHandle(res, 400, '刪除單筆 posts 錯誤');
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