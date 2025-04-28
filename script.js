
    import serviceRegistry from './service-registry.js';

    let cityInput = document.getElementById('city_input'),


    // const searchBox = document.querySelector(".search input");
    searchBtn = document.getElementById(' searchBtn');

    // weatherIcon = document.querySelector(".weather-icon");
 
    async function checkWeather() {
        let city=cityInput.value.trim();
        console.log(city);

        try {
            //��ó��в�ѯID
            const searchServiceUrl = serviceRegistry.searchService;
            const searchResponse = await axios.post(`${searchServiceUrl}/search`, {city});
            const locationID = searchResponse.data.locationID;

    //��ǰ������ѯ����
    const weatherServiceUrl = serviceRegistry.weatherService;
    const weatherResponse = await axios.post(`${weatherServiceUrl}/weather`, {locationID});
    const data = weatherResponse.data;

    //7��������ѯ����
    const dailyWeatherServiceUrl = serviceRegistry.dailyWeatherService;
    const dailyWeatherResponse = await axios.post(`${dailyWeatherServiceUrl}/dailyweather`, {locationID});
    const dailyData = dailyWeatherResponse.data;

    // console.log(data);
    document.querySelector(".city").innerHTML = city;
    document.querySelector(".temp").innerHTML = data.now.temp + "��C";
    document.querySelector(".humidity").innerHTML = data.now.humidity + "%";
    document.querySelector(".wind").innerHTML = data.now.windSpeed + "km/h";

    console.log(data.now.text);

    updateWeatherIcon(data.now.text);


    document.querySelector(".weather").style.display = "block";
    document.querySelector(".error").style.display = "none";
            } catch (error) {
        console.error('�������:', error);
    document.querySelector(".error").style.display = "block";
    document.querySelector(".weather").style.display = "none";
    hourlyScroll.innerHTML = "";
    dailyCards.innerHTML = "";
            }
        }

    function updateWeatherIcon(text) {
                if (text.includes("��")) weatherIcon.src = "images/rain.png";
    else if (text.includes("��")) weatherIcon.src = "images/clear.png";
    else if (text.includes("����")) weatherIcon.src = "images/clouds.png";
    else if (text.includes("ѩ")) weatherIcon.src = "images/snow.png";
    else weatherIcon.src = "images/mist.png";
            }

    searchBtn.addEventListener("click", () => {
        checkWeather(cityInput);
    });
        