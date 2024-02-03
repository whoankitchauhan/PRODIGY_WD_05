const api_key = "d3717856a4b39c442378ced8ab699457";

const inputBox = document.querySelector(".input-box");
const searchBtn = document.getElementById("searchBtn");
const darkModeToggle = document.getElementById("darkModeToggle");
const weather_img = document.querySelector(".weather-img");
const temperature = document.querySelector(".temperature");
const description = document.querySelector(".description");
const humidity = document.getElementById("humidity");
const wind_speed = document.getElementById("wind-speed");
const location_not_found = document.querySelector(".location-not-found");
const weather_body = document.querySelector(".weather-body");
const currentTime = document.getElementById("current-time");
const currentDay = document.getElementById("current-day");

darkModeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  document.querySelector(".container").classList.toggle("dark-mode");
});

async function checkWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const weather_data = await response.json();

    if (
      weather_data.cod === "404" ||
      weather_data.message === "city not found"
    ) {
      handleWeatherError();
      return;
    }

    displayWeatherInfo(weather_data);
  } catch (error) {
    console.error("Error fetching data:", error);
    handleWeatherError();
  }
}

function handleWeatherError() {
  location_not_found.style.display = "flex";
  weather_body.style.display = "none";
}

function displayWeatherInfo(weather_data) {
  location_not_found.style.display = "none";
  weather_body.style.display = "flex";
  temperature.innerHTML = `${Math.round(weather_data.main.temp - 273.15)}°C`;
  description.innerHTML = `${weather_data.weather[0].description}`;
  humidity.innerHTML = `${weather_data.main.humidity}%`;
  wind_speed.innerHTML = `${weather_data.wind.speed}Km/H`;

  switch (weather_data.weather[0].main) {
    case "Clouds":
      weather_img.src = "./assets/cloud.png";
      break;
    case "Clear":
      weather_img.src = "./assets/clear.png";
      break;
    case "Rain":
      weather_img.src = "./assets/rain.png";
      break;
    case "Mist":
      weather_img.src = "./assets/mist.png";
      break;
    case "Snow":
      weather_img.src = "./assets/snow.png";
      break;
  }
}

searchBtn.addEventListener("click", () => {
  checkWeather(inputBox.value);
});

const getCurrentLocationBtn = document.getElementById("getCurrentLocationBtn");

getCurrentLocationBtn.addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const cityName = await getCityNameByCoordinates(latitude, longitude);
        if (cityName) {
          checkWeather(cityName);
        } else {
          console.error("Unable to get city name from coordinates.");
          handleWeatherError();
        }
      },
      (error) => {
        console.error("Error getting current position:", error);
        handleWeatherError();
      }
    );
  } else {
    console.error("Geolocation is not supported by this browser.");
    handleWeatherError();
  }
});

async function getCityNameByCoordinates(latitude, longitude) {
  const reverseGeocodingApiUrl = `http://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=5&appid=${api_key}`;

  try {
    const response = await fetch(reverseGeocodingApiUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    if (data.length > 0) {
      const cityName = data[0].name;
      return cityName;
    }
    return null;
  } catch (error) {
    console.error("Error fetching city name:", error);
    return null;
  }
}

function updateCurrentTimeAndDay() {
  const now = new Date();
  const dayOptions = { weekday: "long" };
  const timeOptions = { hour: "numeric", minute: "numeric", hour12: true };

  const day = now.toLocaleDateString("en-US", dayOptions);
  const time = now.toLocaleTimeString("en-US", timeOptions);

  currentDay.textContent = day;
  currentTime.textContent = time;
}

// Initial update
updateCurrentTimeAndDay();

// Update every minute
setInterval(updateCurrentTimeAndDay, 60000);
