$(document).ready(function(){
    $("button").click(function(){
    
      var name = document.getElementById("name").value;
      var status = document.getElementById("status").value;
      var vehicle = document.getElementById("vehicle").value;
      var plate = document.getElementById("plate").value;
      var date = document.getElementById("date").value;
      var dateParts = date.split('/');
      var formattedDate = dateParts.join('-');
      console.log(formattedDate);

      var table;
      var data;
      var i = 0;
      console.log(name,vehicle,status,plate);
      const url = "https://epark-project-api.herokuapp.com";
        
      fetch(url + "/filterData", {
          method: "POST",
          body: JSON.stringify({
            name: name,
            vehicle: vehicle,
            status: status,
            plate: plate,
            date:formattedDate
          }),
        }).then(async function (response) {
          const res = await response.json();
          data = res.payload;
          console.log(res);
          var status;
          var entry;
          var exit;

          for (let index = 0; index < data.length; index++) {
            const element = data[index];
            console.log(element.user_name);
              i += 1;
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

                //status
                if(element.book_status == 'paid' && element.date_entry == null) {
                  status = "<a href='#' class='btn btn-warning' style='width: 100px;'>Reserved</a>" ;
                } if( element.book_status == "unpaid") {
                  status =  "<a href='#' class='btn btn-dark' style='width: 100px;'>Unpaid</a>";
                }
                if( element.book_status == "expired") {
                  status = "<a href='#' class='btn btn-secondary' style='width: 100px;'>Expired</a>"  ;
                }
                  if( element.book_status == "cancel") {
                    status = "<a href='#' class='btn btn-danger'>Canceled</a>" ;
                  }
                  if( element.book_status == "exited") {
                    status = "<a href='#' class='btn btn-success' style='width: 100px;'>Done</a>" ;
                  }
                  if( element.book_status == "paid" && element.date_entry != null ) {
                    status ="<a href='#' class='btn btn-primary'>Occupied</a>" ;
                }

              table += " <tr > " +
                  "<td>"+ i +"</td>" + 
                  "<td>" +  element.slot_id +" </td>" +
                  "<td>" +  element.user_name+" </td>" +
                  "<td>" +  element.vehicle_type +"</td>" +
                  "<td>" +  element.plate+" </td>" +
                  "<td>" +  element.total_price +"</td>" +
                  "<td>" +  element.user_mobile +" </td>" +
                  "<td>" + entry + "</td>" +
                  "<td>" + exit + "</td>" +
                  "<td>" + status + "</td>" +
          "</tr>";

        } ;
       document.getElementById("datatable").innerHTML = table;
          console.log(data);
        });
      });
     
    
   });