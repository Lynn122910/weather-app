import serviceRegistry from './service-registry.js';

let cityInput = document.getElementById('city_input'),
    searchBtn = document.getElementById('searchBtn'),
    currentWeatherCard = document.querySelector('.weather-data .card'),
    sevenDaysForecast = document.querySelector('.day-forecast'),
    Cards = document.querySelector('.highlights');

async function checkWeather(cityOrLocationID) {
    if (!cityOrLocationID) return;

    try {
        // 显示加载状态
        document.querySelector('.weather-data').style.display = 'none';
        document.querySelector('.error').style.display = 'none';

        let locationID = cityOrLocationID;
        let cityName = cityOrLocationID;

        if (!/^\d{9}$/.test(cityOrLocationID)) {
            const searchServiceUrl = serviceRegistry.searchService;
            const searchResponse = await axios.post(`${searchServiceUrl}/search`, { city: cityOrLocationID });
            if (!searchResponse.data || !searchResponse.data.locationID) {
                throw new Error('未找到城市信息');
            }
            locationID = searchResponse.data.locationID;
            cityName = cityOrLocationID;
        }

        const weatherServiceUrl = serviceRegistry.weatherService;
        const weatherResponse = await axios.post(`${weatherServiceUrl}/weather`, { locationID });
        const data = weatherResponse.data;
        if (!data || !data.now) {
            throw new Error('获取天气数据失败');
        }

        currentWeatherCard.innerHTML = `
            <div class="current-weather">
                <div class="details">
                    <p>当前天气</p>
                    <h2>${data.now.temp}°C</h2>
                    <p>${data.now.text}</p>
                </div>
                <div class="weather-icon">
                    <i class="qi-${data.now.icon} qi-${data.now.icon}-fill"></i>
                </div>
            </div>
            <hr>
            <div class="card-footer">
                <p><i class="fa-light fa-calendar"></i>${new Date().toLocaleDateString()}</p>
                <p id="cityName"><i class="fa-light fa-location-dot"></i>${cityName}</p>
            </div>
        `;

        const dailyWeatherServiceUrl = serviceRegistry.dailyWeatherService;
        const dailyWeatherResponse = await axios.post(`${dailyWeatherServiceUrl}/dailyweather`, { locationID });
        const dailyData = dailyWeatherResponse.data;
        if (!dailyData || !dailyData.daily) {
            throw new Error('获取7天天气数据失败');
        }

        Cards.innerHTML = `
            <div class="card">
                <p>日出时间</p>
                <p>${dailyData.daily[0].sunrise}</p>
            </div>
            <div class="card">
                <p>日落时间</p>
                <p>${dailyData.daily[0].sunset}</p>
            </div>
            <div class="card">
                <p>风速</p>
                <p>${data.now.windSpeed}km/h</p>
            </div>
            <div class="card">
                <p>相对湿度</p>
                <p>${data.now.humidity}%</p>
            </div>
            <div class="card">
                <p>风向</p>
                <p>${data.now.windDir}</p>
            </div>
            <div class="card">
                <p>能见度</p>
                <p>${data.now.vis}km</p>
            </div>
        `;

        // 更新7天天气预报
        sevenDaysForecast.innerHTML = dailyData.daily.map(day => {
            const date = new Date(day.fxDate);
            const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
            const weekday = weekdays[date.getDay()];
            const formattedDate = `${date.getMonth() + 1}/${date.getDate()}`;
            return `
                <div class="forecast-item">
                    <div class="icon-wrapper">
                        <i class="qi-${day.iconDay} qi-${day.iconDay}-fill"></i>
                        <span>${day.tempMin}°C / ${day.tempMax}°C</span>
                    </div>
                    <p>${formattedDate}</p>
                    <p>${weekday}</p>
                </div>
            `;
        }).join('');

        // 显示天气数据
        document.querySelector('.weather-data').style.display = 'block';
        document.querySelector('.error').style.display = 'none';

    } catch (error) {
        console.error('请求出错:', error);
        document.querySelector('.error').style.display = 'block';
        document.querySelector('.weather-data').style.display = 'none';
    }
}

searchBtn.addEventListener("click", () => {
    checkWeather(cityInput.value.trim());
    cityInput.value = "";
});

window.addEventListener('DOMContentLoaded', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                try {
                    const locationServiceUrl = serviceRegistry.locationService;
                    const locationResponse = await axios.post(`${locationServiceUrl}/location`, { lat, lon });
                    if (locationResponse.data && locationResponse.data.locationID) {
                        checkWeather(locationResponse.data.locationID);
                    }
                } catch (e) {
                    console.warn('自动定位失败', e);
                }
            },
            (error) => {
                console.warn('获取地理位置失败:', error);
            }
        );
    }
});