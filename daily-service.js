const express = require(`express`);
const cors = require('cors');
const axios = require('axios');
const app = express();
const port = 3003;
const apikey = "8afa3b09dd2b4e9e81a343a5849ca454";

app.use(cors());
app.use(express.json());

app.post('/dailyweather', async (req, res) => {
    const locationID = req.body.locationID;
    if (!locationID) {
        return res.status(400).json({ error: "locationID不能为空" });
    }
    try {
        const dailyWeatherResponse = await axios.get(
            `https://nn3yfq4ybh.re.qweatherapi.com/v7/weather/7d?location=${locationID}&key=${apikey}`
        );
        res.json(dailyWeatherResponse.data);
    } catch (error) {
        console.error("7天天气查询失败:", error);
        res.status(404).json({ error: '未找到该城市的未来7日天气信息' });
    }
});

app.listen(port, () => {
    console.log(`7日天气查询服务运行在端口${port}`);
});