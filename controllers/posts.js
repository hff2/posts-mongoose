const { successHandle, errorHandle } = require('../service/responseHandle')
const Post = require('../models/post')

const posts = {
    /* GET */
    async getPosts({ req, res }) {
        try {
            const allPosts = await Post.find();
            successHandle(res, 200, allPosts)
        }
        catch (e) {
            console.error(e)
            errorHandle(res, 400, '取得 posts 錯誤')
        }
    },

    /* POST */
    async createPosts({ body, req, res }) {
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
    },

    /* DELETE ALL */
    async deleteAllPosts({ req, res }) {
        try {
            await Post.deleteMany({});
            successHandle(res, 200, []);
        }
        catch (e) {
            console.error(e)
            errorHandle(res, 400, '刪除全部 posts 錯誤')
        }
    },

    /* DELETE ONE */
    async deleteOnePost({ req, res, url }) {
        try {
            const postId = url.split('/').pop();
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
    },

    /* PATCH */
    async patchPosts({ body, url, req, res }) {
        try {
            /* 確認內容 */
            const postId = url.split('/').pop();
            const data = JSON.parse(body);
            const { content } = data;
            if (!content) {
                errorHandle(res, 400, '修改資料失敗，需填寫內文');
                return
            }
            /* 確認內容 與 id */
            const result = await Post.findByIdAndUpdate(postId, { content });
            if (!result) {
                errorHandle(res, 400, '無此 posts')
                return
            }
            const posts = await Post.find()
            successHandle(res, 200, posts)
        } catch {
            errorHandle(res, 400, '修改資料失敗，欄位名稱錯誤或無此 ID');
        }
    }
}

module.exports = posts 