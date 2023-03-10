const userTab = document.querySelector("[data-userWeather]");
const searchTab = document.querySelector("[data-searchWeather]");
const userContainer = document.querySelector(".weather-container");

const grantAcessContainer = document.querySelector(".grant-location-container");
const searchForm = document.querySelector("[data-searchForm]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".useruser-info-conatiner");

let currentTab = userTab;
const API_key = "b3fbcc5265670448b43c4c538678a35e";
currentTab.classList.add("current-tab");
getFromSessionStorage();

userTab.addEventListener("click", () => {
  switchTab(userTab);
});
searchTab.addEventListener("click", () => {
  switchTab(searchTab);
});

function switchTab(clickedTab) {
  if (clickedTab != currentTab) {
    currentTab.classList.remove("current-tab");
    currentTab = clickedTab;
    currentTab.classList.add("current-tab");

    if (!searchForm.classList.contains("active")) {
      userInfoContainer.classList.remove("active");
      grantAcessContainer.classList.remove("active");
      searchForm.classList.add("active");
    } else {
      searchForm.classList.remove("active");
      userContainer.classList.remove("active");
      getFromSessionStorage();
    }
  }
}

function getFromSessionStorage() {
  //   console.log("entered");
  const localCoordinate = sessionStorage.getItem("user-coordinates");
  if (!localCoordinate) {
    grantAcessContainer.classList.add("active");
  } else {
    const coordinates = JSON.parse(localCoordinate);
    fetchUserWeatherInfom(coordinates);
  }
}

async function fetchUserWeatherInfom(coordinates) {
  const { lat, lon } = coordinates;
  grantAcessContainer.classList.remove("active");
  loadingScreen.classList.add("active");

  //   API call
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_key}`
    );
    // console.log(response);
    const data = await response.json();
    loadingScreen.classList.remove("active");
    userInfoContainer.classList.add("active");
    renderInfo(data);
    // console.log(renderInfo(data));
    console.log("entered");
  } catch (err) {
    loadingScreen.classList.remove("active");
  }
}

// rendering the data

function renderInfo(weatherInfo) {
  console.log("entered");
  const cityName = document.querySelector("[data-cityName]");
  const countryIcon = document.querySelector("[data-countryIcon");
  const desc = document.querySelector("[data-weatherDesc]");
  const weatherIcon = document.querySelector("[data-weatherIcon]");
  const temp = document.querySelector("[data-temp]");
  const windSpeed = document.querySelector("[data-windSpeed]");
  const humidity = document.querySelector("[data-humidity]");
  const clouds = document.querySelector("[data-cloudiness]");
  //   console.log(weatherInfo);
  //   fetch values from weather info object putting ui elements
  cityName.innerText = weatherInfo?.name;

  countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
  desc.innerText = weatherInfo?.weather?.[0]?.description;
  weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
  temp.innerText = weatherInfo?.main?.temp;
  windSpeed.innertext = weatherInfo?.wind?.speed;
  humidity.innertext = weatherInfo?.main?.humidity;
  clouds.innerText = weatherInfo?.clouds?.all;
}

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    // show an alert no geolocation support available
  }
}

function showPosition(position) {
  const userCoordinates = {
    lat: position.coords.latitude,
    lon: position.coords.longitude,
  };
  sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
  fetchUserWeatherInfom(userCoordinates);
}

const grantAccessButton = document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click", getLocation);

const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let cityName = searchInput.value;

  if (cityName === "") return;
  else fetchSearchWeatherInfo(cityName);
});

async function fetchSearchWeatherInfo(city) {
  loadingScreen.classList.add("active");
  userInfoContainer.classList.remove("active");
  grantAcessContainer.classList.remove("active");

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_key}&units=metric`
    );
    const data = await response.json();
    loadingScreen.classList.remove("active");
    userInfoContainer.classList.add("active");
    renderWeatherInfo(data);
  } catch (err) {
    //hW
  }
}
