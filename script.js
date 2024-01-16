const ipAddress = document.getElementById("ip-address");
const country = document.getElementById("country");
const city = document.getElementById("city");
const postalCode = document.getElementById("postal-code");
const timezone = document.getElementById("timezone");
const isp = document.getElementById("isp");
const searchForm = document.getElementById("search");
const searchInput = document.getElementById("search-text");
const loader = document.getElementById("preloader");

function displayLoader() {
  loader.style.display = "block";
}
function hideLoader() {
  loader.style.display = "none";
}

function getData(link) {
  displayLoader();
  fetch(link)
    .then((res) => res.json())
    .then((data) => {
      hideLoader();
      ipAddress.innerHTML = `${data.ip}`;
      country.innerHTML = `${data.location.country}`;
      city.innerHTML = `${data.location.city}`;
      postalCode.innerHTML = `${data.location.postalCode}`;
      timezone.innerHTML = `UTC   ${data.location.timezone}`;
      isp.innerHTML = `${data.isp}`;

      let x = `${data.location.lat}`;
      let y = `${data.location.lng}`;

      // Select map-wrapper and map
      const mapWrp = document.querySelector(".map-wrapper");
      var map = document.querySelector("#map");

      //Create a new map element
      const newMap = document.createElement("div");
      newMap.setAttribute("id", "map");

      // Remove older/previous map element
      mapWrp.removeChild(map);

      // insert new map element
      mapWrp.append(newMap);

      //draw map
      var map = L.map("map").setView([x, y], 20);
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      //change marker icon
      var locationIcon = new L.Icon({
        iconUrl: "images/icon-location.svg",
        iconSize: [25, 35],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });
      L.marker([x, y], { icon: locationIcon }).addTo(map);

      //map animation
      map.flyTo([x, y], 16, {
        animate: true,
        duration: 1,
      });
    });
}

let link =
  "https://geo.ipify.org/api/v2/country,city?apiKey=at_sqdWZfbOFhnsuhvmRtco38bFFwHNH&";
getData(link);

searchForm.addEventListener("submit", function (e) {
  e.preventDefault();
  let address = searchInput.value;

  function ValidateIPaddress(ipaddress) {
    if (
      /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
        ipaddress
      )
    ) {
      return true;
    }
    alert("You have entered an invalid IP address!");
    return false;
  }

  const validIP = ValidateIPaddress(address);

  if (validIP) {
    newLink = link.concat("ipAddress=" + address);
    getData(newLink);
  }
});
