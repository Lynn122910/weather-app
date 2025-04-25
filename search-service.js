//创建express服务器
const { log } = require('console');
const express = require('express');
const cors = require('cors');
const app = express();
const port = 3001;

//添加cors中间件 解决跨域请求问题
app.use(cors());
app.use(express.json());

//城市名称验证
app.post(`/search`, (req, res) => {
    const city = req.body.city;
    if (!city) {
        res.status(400).json({ error: '城市名称不能为空' });
    } else {
        res.json({ city });
    }
});

app.listen(port, () => {
    console.log(`搜索服务运行在端口${port}`);
});
