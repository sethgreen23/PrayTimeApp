// const axios = require('./node_modules/axios/index.cjs'); // node

let prayCities = document.querySelector(".pray-cities")
let citiesList = document.querySelector(".pray-cities-list");
prayCities.addEventListener("click",(event)=>{
  prayCities.classList.toggle("active");
})
prayCities.addEventListener("blur",(event)=>{
  prayCities.classList.remove("active")
})

getCitiesNames();
function getCitiesNames(){
  axios({
    method: 'post',
    url: 'https://countriesnow.space/api/v0.1/countries/cities',
    data: {
      "country": "Tunisia"
  }
  })
  .then((response)=>{

      let citiesList = document.querySelector(".pray-cities-list");
      citiesList.innerHTML="";
      // console.log(response.data)
      let firstElement ;
      let counter = 0;
      for(let city of response.data.data){
        // console.log(city)
        let liElement = document.createElement("li");
        liElement.classList.add("pray-city");
        liElement.setAttribute('data-name',city);

        liElement.textContent = city;
        liElement.addEventListener("click", selectCity);
        citiesList.appendChild(liElement);
        if(counter==0){
          firstElement = liElement;
          counter++;
        }
      }
      document.querySelector(".placeholder").innerHTML = firstElement.getAttribute("data-name");
      getCityPrayTime(firstElement.getAttribute("data-name"));
      
    })
}


function selectCity(event){
  let placeholder = document.querySelector(".placeholder");
  let data = event.target.getAttribute("data-name");
  // console.log(data)
  // console.log(event)
  placeholder.innerHTML = data;
  getCityPrayTime(data)
}

function getCityPrayTime(name){
  let url = `http://api.aladhan.com/v1/timingsByCity/14-04-2023?city=${name}&country=Tunisia&method=8`
  axios({
    method: 'get',
    url: url,
    responseType: 'json'
  })
    .then(function (response) {
      console.log(response.data.data.date.readable);
      let timings = response.data.data.timings;
      // fill all the element inside the praying fields
      document.getElementById("fajr").querySelector(".pray-time").innerHTML=processTime(timings.Fajr);
      document.getElementById("chourouk").querySelector(".pray-time").innerHTML=processTime(timings.Sunrise);
      document.getElementById("dohr").querySelector(".pray-time").innerHTML=processTime(timings.Dhuhr);
      document.getElementById("asr").querySelector(".pray-time").innerHTML=processTime(timings.Asr);
      document.getElementById("maghrib").querySelector(".pray-time").innerHTML=processTime(timings.Maghrib);
      document.getElementById("isha").querySelector(".pray-time").innerHTML=processTime(timings.Isha);
      // fill the time and name of the city
      document.querySelector(".city-name").innerHTML = name;
      let date = new Date(response.data.data.date.readable);
      let weekDays = ["Monday", "Tuesday", "Wednesday", "Thirsday", "Friday", "Saturday", "Sunday"];
      let monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      // console.log(weekDays[date.getDay()]+" "+monthNames[date.getMonth()]+","+date.getFullYear())
      document.querySelector(".date").innerHTML = weekDays[date.getDay()]+" "+monthNames[date.getMonth()]+","+date.getFullYear();
    });
}

function processTime(time){
  let hours = time.split(":")[0];
  console.log(hours)
  
  return `${time} ${hours <12?"AM":"PM"}`;
}