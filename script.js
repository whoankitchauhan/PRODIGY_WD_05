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

darkModeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  document.querySelector(".container").classList.toggle("dark-mode");
});

async function checkWeather(city) {
  const api_key = "4cd0eee81294c867b4bc4cfc64e998c5";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api_key}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const weather_data = await response.json();

    if (weather_data.cod === `404`) {
      location_not_found.style.display = "flex";
      weather_body.style.display = "none";
      return;
    }

    location_not_found.style.display = "none";
    weather_body.style.display = "flex";
    temperature.innerHTML = `${Math.round(weather_data.main.temp - 273.15)}°C`;
    description.innerHTML = `${weather_data.weather[0].description}`;
    humidity.innerHTML = `${weather_data.main.humidity}%`;
    wind_speed.innerHTML = `${weather_data.wind.speed}Km/H`;

    switch (weather_data.weather[0].main) {
      case "Clouds":
        weather_img.src = "/assets/cloud.png";
        break;
      case "Clear":
        weather_img.src = "/assets/clear.png";
        break;
      case "Rain":
        weather_img.src = "/assets/rain.png";
        break;
      case "Mist":
        weather_img.src = "/assets/mist.png";
        break;
      case "Snow":
        weather_img.src = "/assets/snow.png";
        break;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

searchBtn.addEventListener("click", () => {
  checkWeather(inputBox.value);
});
