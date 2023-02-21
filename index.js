const apikey = "f7d63b9a0a45493e9cb52439231302";

navigator.geolocation.getCurrentPosition((location) => {
  fetch(
    "https://api.weatherapi.com/v1/forecast.json?key=f7d63b9a0a45493e9cb52439231302&q= " +
      location.coords.latitude +
      "," +
      location.coords.longitude +
      "&aqi=yes&days=8"
  )
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      Displayweather(data);
      console.log(data);
    });
});
const Weatherfunction = (city) => {
  console.log("c", city);
  fetch(
    "https://api.weatherapi.com/v1/forecast.json?key=f7d63b9a0a45493e9cb52439231302&q= " +
      city +
      "&aqi=yes&days=8"
  )
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      console.log(data);
      try {
        Displayweather(data);
      } catch (err) {
        alert(err);
      }
    });
};
const autocomplete = (city) => {
  console.log(city);
  fetch(
    "https://api.weatherapi.com/v1/search.json?key=f7d63b9a0a45493e9cb52439231302&&q=" +
      city
  )
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      var populate = document.getElementById("populate");
      if (data) {
        let options = data.map((location, index) => {
          return ` <div style="cursor:pointer;" onclick="optionClicked('${
            location.name
          }')" class="d-grid ${
            data.length - 1 === index ? "" : "border-bottom"
          } py-1">
                            <span class="fs-low">
                                ${location.name}
                            </span>
                            <span class="base-text"> ${location.country}</span>
                        </div>`;
        });
        if (options.length > 0) {
          populate.setAttribute(
            "class",
            populate.getAttribute("class").replace(" d-none", "")
          );
        } else {
          populate.setAttribute(
            "class",
            `${populate.getAttribute("class").replace(" d-none", "")} d-none`
          );
        }
        populate.innerHTML = options.join("\n");
      }
    });
};

const optionClicked = (location) => {
  document.getElementById("search-input").value = location;
  populate.setAttribute(
    "class",
    `${populate.getAttribute("class").replace(" d-none", "")} d-none`
  );
  console.log("location", location);

  Weatherfunction(location);
};

const Displayweather = (data) => {
  populate.setAttribute(
    "class",
    `${populate.getAttribute("class").replace(" d-none", "")} d-none`
  );
  const { name, region, country } = data.location;
  const { temp_c, temp_f, pressure_in, is_day, wind_dir } = data.current;
  const { code, text } = data.current.condition;
  const { sunrise, sunset } = data.forecast.forecastday[0].astro;
  const { avghumidity, maxwind_kph, uv, daily_chance_of_rain } =
    data.forecast.forecastday[0].day;
  const { date } = data.forecast.forecastday[0];
  if (is_day === 1) {
    document.getElementById("logo").src = "./icons/day/" + code + ".svg";
  } else {
    document.getElementById("logo").src = "./icons/night/" + code + ".svg";
  }
  const weekday = ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat"];
  const month = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Nov",
    "Dec",
  ];
  let day = new Date(date);
  document.getElementById("today").innerHTML =
    weekday[day.getDay()] +
    ", " +
    month[day.getMonth()] +
    " " +
    date.slice(8, 10) +
    " " +
    date.slice(0, 4);
  document.getElementById("city").innerHTML = name;
  document.getElementById("region").innerHTML = region + "," + country;
  document.getElementById("temp").innerHTML = temp_c + " °C";
  document.getElementById("text").innerHTML = text + " Day";
  document.getElementById("srise").innerHTML = sunrise;
  document.getElementById("sset").innerHTML = sunset;
  document.getElementById("wspeed").innerHTML = maxwind_kph + " km/hr";
  document.getElementById("humidity").innerHTML = avghumidity + " %";
  document.getElementById("uv").innerHTML = uv;
  document.getElementById("pressure").innerHTML = pressure_in;
  document.getElementById("windd").innerHTML = wind_dir;
  document.getElementById("rain").innerHTML = daily_chance_of_rain;

  let value = "";
  data.forecast.forecastday.slice(1, 8).map((data) => {
    let d = new Date(data.date);
    value =
      value +
      `<div class=" rounded rounded-3 d-flex  flex-column justify-content-evenly align-items-center bg-white shadow shadow-md border border-1 forecast-card ">
            <span class="fs-6 fw-bold">${weekday[d.getDay()]}</span>
            <img width="40px" src="./icons/day/${
              data.day.condition.code
            }.svg" alt="night-drizzle" />
            <span class="base-text fw-bold text-black-50">${
              data.day.maxtemp_c + " °C"
            }</span>
        </div >`;
  });
  document.getElementById("days").innerHTML = value;
};
const search = () => {
  document.querySelector(".search-bar").addEventListener("keydown", (event) => {
    if (event.key == "Enter") {
      Weatherfunction(event.target.value);
    } else {
      autocomplete(event.target.value);
    }
  });
};
