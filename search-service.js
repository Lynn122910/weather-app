//创建express服务器
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();
const port = 3001;
const apikey = "8afa3b09dd2b4e9e81a343a5849ca454";

app.use(cors());
app.use(express.json());

app.post(`/search`, async(req, res) => {
    const city = req.body.city.trim();
    if (!city) {
        res.status(400).json({ error: '城市名称不能为空' });
    } 
    try{
        const geoResponse = await axios.get(
            `https://nn3yfq4ybh.re.qweatherapi.com/geo/v2/city/lookup?location=${city}&key=${apikey}`
        );
        const locations = geoResponse.data.location;
        if (locations.length === 0) {
            return res.status(404).json({ error: "未找到该城市" });
        }
        const locationID = locations[0].id; 
        res.json({ locationID });
    } catch (error) {
        console.error("GEO搜索失败:", error);
        res.status(500).json({ error: "城市搜索服务失败" });
    }
});

app.listen(port, () => {
    console.log(`搜索服务运行在端口${port}`);
});
