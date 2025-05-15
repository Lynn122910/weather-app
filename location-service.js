//创建express服务器
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();
const port = 3004;
const apikey = "8afa3b09dd2b4e9e81a343a5849ca454";

app.use(cors());
app.use(express.json());

app.post(`/location`, async (req, res) => {
    const { lat, lon } = req.body;
    if (!lat || !lon) {
        return res.status(400).json({ error: "获取经纬度参数失败" });
    }
    try {
        const locationResponse = await axios.get(
            `https://nn3yfq4ybh.re.qweatherapi.com/geo/v2/city/lookup?location=${lon},${lat}&key=${apikey}`
        );
        const currentLocation = locationResponse.data.location;
        if (currentLocation.length === 0) {
            return res.status(404).json({ error: "未找到该城市" });
        }
        console.log("当前位置:", currentLocation[0].name);
        
        res.json({ city: currentLocation[0].name });
    } catch (error) {
        console.error("当前位置定位失败:", error);
        res.status(500).json({ error: "位置定位服务失败" });
    }
});

app.listen(port, () => {
    console.log(`定位服务运行在端口${port}`);
});
