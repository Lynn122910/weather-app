const express = require(`express`);
const cors = require('cors');
const axios = require('axios');
const app = express();
const port = 3002;
const apikey = "8afa3b09dd2b4e9e81a343a5849ca454";

app.use(cors());
app.use(express.json());

app.post('/weather', async (req, res) => {
    const locationID = req.body.locationID;
    if (!locationID) {
        return res.status(400).json({ error: "locationID不能为空" });
    }
    try {
        const weatherResponse = await axios.get(
            `https://nn3yfq4ybh.re.qweatherapi.com/v7/weather/now?location=${locationID}&key=${apikey}`
        );
        res.json(weatherResponse.data);
    } catch (error) {
        console.error("天气查询失败:", error);
        res.status(404).json({ error: '未找到该城市的天气信息' });
    }
});

app.listen(port, () => {
    console.log(`天气查询服务运行在端口${port}`);
});
