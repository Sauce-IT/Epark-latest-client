$(document).ready(function(){
    $("button").click(function(){
    
      var name = document.getElementById("name").value;
      var date = document.getElementById("date").value;
      var vehicle = document.getElementById("vehicle").value;
      var plate = document.getElementById("plate").value;

      console.log(name,date,vehicle,plate);
      const url = "https://epark-project-api.herokuapp.com";
        
      fetch(url + "/getAllBookings", {
          method: "POST",
          body: JSON.stringify({
            name: name,
            date: date,
            vehicle: vehicle,
            plate: plate
          }),
        }).then(async function (response) {
          const res = await response.json();
          console.log(res);
        });
    });
    
   });