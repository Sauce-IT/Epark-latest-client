$(document).ready(function(){
    $("button").click(function(){
    
      var name = document.getElementById("name").value;
      // var status = document.getElementById("status").value;
      var vehicle = document.getElementById("vehicle").value;
      var plate = document.getElementById("plate").value;
      var date = document.getElementById("date").value;
      var dateParts = date.split('/');
      var formattedDate = dateParts.join('-');
      console.log(formattedDate);

      var table;
      var data;

      const url = "https://epark-project-api.herokuapp.com";
    
      fetch(url + "/filterData", {
        method: "POST",
        body: JSON.stringify({
          name: name,
          vehicle: vehicle,
          status: "exited",
          plate: plate,
          date: ""
        }),
      }).then(async function (response) {
        const res = await response.json();
          data = res.payload;          
          console.log(res);

          var entry;
          var exit;
          
          for (let index = 0; index < data.length; index++) {
              const element = data[index];
               
              //entry
                if(element.book_status == 'paid' && element.date_entry == null  || element.date_entry == "" || element.date_entry == undefined){ 
                  entry = "<p style='color:red;'> No entry yet</p>";
                }else if(element.book_status == 'unpaid'){ 
                  entry =" <p style='color:red;'>Cannot enter yet</p>";
                }else if(element.book_status == 'expired'){ 
                  entry = "<p style='color:red;'>No Entry</p>" ;
                }else if(element.book_status == 'cancel'){ 
                  entry = "<p style='color:red;'>Cannot Enter</p>" ;
                }else {
                  entry = element.date_entry  ;
                } 
                //exit
                if(element.date_exit == null || element.date_exit == "" || element.date_exit == undefined){ 
                  exit = "<p style='color:blue;'>No Exit yet </p>";
                  }else { 
                      if(element.date_exit >= element.park_hrs && element.date_exit != null && element.date_entry != null  ){
                        exit = "<p style='color:red;'>" +  element.date_exit + " </p>";
                      }else{
                        exit = element.date_exit ;
                      } 
                  }
                  var payment = element.paid_date;
                  if(element.paid_date == null){
                    payment = "No payment";
                  }

                table += " <tr > " +
                    "<td>" +  element.user_name+" </td>" +
                    "<td>" +  element.vehicle_type +"</td>" +
                    "<td>" +  element.plate+" </td>" +
                    "<td>" +  element.user_mobile +" </td>" +
                    "<td>" +  payment +" </td>" +
                    "<td>" + entry + "</td>" +
                    "<td>" + exit + "</td>" +
            "</tr>";

          } ;
          if(res.status.remarks == "failed")
          {
            document.getElementById("datatable").innerHTML = `<tr><td colspan="10"><center>No Data found</center></td></tr>`;
  
          }else{
            document.getElementById("datatable").innerHTML = table.replace('undefined','');
          }
        });
      });
     
    
   });