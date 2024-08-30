window.addEventListener('load', function() {
  const savedCity = localStorage.getItem('selectedCity');
  const savedWeatherData = localStorage.getItem(savedCity);

  // Function to fetch weather data from API
  function fetchWeatherData(city) {
    var apiKey = 'a5961b895f25323dc5110b88fc2d7240';
    var apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`;

    // Fetch weather data from the API
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        // Update the weather information in the HTML
        updateWeatherInformation(data);

        // Save the searched city and its weather data
        saveSearchedData(city, data);
      })
      .catch(error => {
        console.error('Error:', error);
        // Fetch weather data from local storage if not available in API
        fetchWeatherDataFromLocalStorage(city);
      });
  }

  // Function to fetch weather data from local storage
  function fetchWeatherDataFromLocalStorage(city) {
    // Get the saved data from local storage
    var savedData = JSON.parse(localStorage.getItem('searchedData'));

    if (savedData && savedData[city]) {
      var data = savedData[city];

      // Update the weather information in the HTML
      updateWeatherInformation(data);
    } else {
      // Display default city data (Florence) in case of data not available in local storage
      displayDefaultCityData();
    }
  }

  // Function to update the weather information in the HTML
  function updateWeatherInformation(data) {
    document.getElementById('temp').textContent = Math.round(data.main.temp);
    document.getElementById('conditions').textContent = data.weather[0].main;
    document.getElementById('humidity').textContent = data.main.humidity;
    document.getElementById('wind-speed').textContent = Math.round(data.wind.speed);

    // Get the weather icon element
    var weatherIcon = document.getElementById('weather-icon');
    // Set the weather icon based on the weather condition
    weatherIcon.setAttribute('src', getWeatherIcon(data.weather[0].icon));
  }

  // Function to get the weather icon URL based on the icon code
  function getWeatherIcon(iconCode) {
    return `https://openweathermap.org/img/w/${iconCode}.png`;
  }

  // Rest of the code...

  // Function to display default city data (Florence)
  function displayDefaultCityData() {
    document.getElementById('temp').textContent = 'N/A';
    document.getElementById('conditions').textContent = 'N/A';
    document.getElementById('humidity').textContent = 'N/A';
    document.getElementById('wind-speed').textContent = 'N/A';
  }

  // Function to save searched city and its weather data in local storage
  function saveSearchedData(city, data) {
    // Get the existing data from local storage or initialize an empty object
    var savedData = JSON.parse(localStorage.getItem('searchedData')) || {};

    // Add or update the search data with the city as the key
    savedData[city] = data;

    // Save the updated data object in local storage
    localStorage.setItem('searchedData', JSON.stringify(savedData));
  }

  // Function to get the current date
  function getCurrentDate() {
    var currentDate = new Date();
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return currentDate.toLocaleDateString(undefined, options);
  }

  // Get the city input element
  var cityInput = document.getElementById('city');
  var defaultCity = 'Florence'; // Set the default city

  // Set the default city and date when loading the page
  cityInput.value = savedCity || defaultCity;
  document.getElementById('date').textContent = getCurrentDate();

  // If a city is saved, fetch weather data from local storage
  if (savedCity) {
    fetchWeatherDataFromLocalStorage(savedCity);
  } else {
    // Fetch weather data for the default city
    fetchWeatherData(defaultCity);
  }

  // Add an event listener to the form for saving the selected city and fetching weather data
  var form = document.querySelector('form');
  form.addEventListener('submit', function(event) {
    event.preventDefault();

    // Get the selected city from the input
    var selectedCity = cityInput.value;

    // Save the selected city in local storage
    localStorage.setItem('selectedCity', selectedCity);

    // Fetch weather data for the selected city
    fetchWeatherData(selectedCity);
  });
});
