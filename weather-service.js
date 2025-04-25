const express = require(`express`);
const cors = require('cors');
const app = express();
const port = 3002;
const axios = require('axios');
const { log } = require('console');

app.use(cors());
app.use(express.json());

const apiKey = "d05058736ec59342f611b738e32d7a1c";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&lang=zh_cn&q=";//修改语言

app.post('/weather', async (req, res) => {
    const city = req.body.city;
    try {
        const response = await axios.get(apiUrl + city + `&appid=${apiKey}`,{
            timeout:5000 //设置超时时间5秒
        });
        res.json(response.data);
    } catch (error) {
        res.status(404).json({ error: '未找到该城市的天气信息' });
    }
});

app.listen(port, () => {
    console.log(`天气查询服务运行在端口${port}`);
});
