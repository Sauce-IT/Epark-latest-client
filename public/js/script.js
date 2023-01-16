const barchart = document.querySelectorAll(".barchart");
// const url = "https://e-park.herokuapp.com";
const url = "https://epark-project-api.herokuapp.com";

const data = [];
const label = [];

const data_exited = [];
const label_exited = [];

const data_canceled = [];
const label_canceled = [];

const data_expired = [];
const label_expired = [];


barchart.forEach(function (chart) {
  // get data from database
  fetch(url + "/getForchart", {
    method: "POST",
    body: JSON.stringify({
      user_email: "",
    }),
  }).then(async function (response) {
    const res = await response.json();
    if (res.status["remarks"] === "failed") {
      console.log("failed");
    } else {
      res.payload.forEach((count) => {
        if (count.paid_date == null) {
          label.push("0");
          data.push("0");
        } else {
          label.push(count.paid_date);
          data.push(count.total);
        }
      });

      //end

      var ctx = chart.getContext("2d");
      var myChart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: label,
          datasets: [
            {
              label: "Daily Earnings",
              data: data,
              backgroundColor: [
                // "rgba(255, 99, 132, 0.2)",
                "rgba(54, 162, 235, 0.2)",
                // "rgba(255, 206, 86, 0.2)",
                // "rgba(75, 192, 192, 0.2)",
                // "rgba(153, 102, 255, 0.2)",
                // "rgba(255, 159, 64, 0.2)",
              ],
              borderColor: [
                // "rgba(255, 99, 132, 1)",
                "rgba(54, 162, 235, 1)",
                // "rgba(255, 206, 86, 1)",
                // "rgba(75, 192, 192, 1)",
                // "rgba(153, 102, 255, 1)",
                // "rgba(255, 159, 64, 1)",
              ],
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
              ticks:{
                callback:(value,index,values) =>{
                  console.log(values)
                  return `\u20B1 ${value} .00`;
                }
              }
            },
          },
        },
      });
      // end else
    }
  });
});

const linechart = document.querySelectorAll(".linechart");

linechart.forEach(function (chart) {
  // get data from database
  fetch(url + "/linechart", {
    method: "POST",
    body: JSON.stringify({
      user_email: "",
    }),
  }).then(async function (response) {
    const res = await response.json();
    if (res.status["remarks"] === "failed") {
      console.log("failed");
     
    } else {
      console.log(res);
      // const date1 = new Date();
      // const date2 = new Date(res.payload[0].date);
      // const diffTime = Math.abs(date2 - date1);
      // const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
     
      const today = new Date();
      const dates = [];

      for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(today.getDate() - i);
        dates.push(date.getFullYear() + "-" + date.toLocaleString('default', { month: '2-digit' }) + "-" +  date.toLocaleString('default', { day: '2-digit' }) );
      
      }
      
      for (let i = 0; i < res.payload.length; i++) {

          
          for (let index = 0; index < 7; index++) {

            if(res.payload[i].book_status ==  "exited" && res.payload[i].date == dates[index]){

              data_exited.push(res.payload[i].count);
              label_exited.push(res.payload[i].date);

            }else if(res.payload[i].book_status ==  "cancel" && res.payload[i].date == dates[index]){
              
              data_canceled.push(res.payload[i].count);
              label_canceled.push(res.payload[i].date);

            }else if(res.payload[i].book_status ==  "expired" && res.payload[i].date == dates[index]){
              
              data_expired.push(res.payload[i].count);
              label_expired.push(res.payload[i].date);

            }else{
             
            }
            
          }
         
        }

       // Initialize an empty array to store the values
      let exited = [];
      let canceled = [];
      let expired = [];

    // Iterate through the first data set (dates)
      for (let i = 0; i < dates.length; i++) {
        let foundexited = false;
        let foundcanceled = false;
        let foundexpired = false;
        // Iterate through the second data set (dateValues)
        for (let j = 0; j < label_exited.length; j++) {
            if (dates[i] === label_exited[j]) {
                // If the date is found, add 1 to the array
                exited.push(data_exited[j]);
                foundexited = true;
                break;
            }
        }
        for (let j = 0; j < label_canceled.length; j++) {
          if (dates[i] === label_canceled[j]) {
              // If the date is found, add 1 to the array
              canceled.push(data_canceled[j]);
              foundcanceled = true;
              break;
          }
      }
      for (let j = 0; j < label_expired.length; j++) {
        if (dates[i] === label_expired[j]) {
            // If the date is found, add 1 to the array
            expired.push(data_expired[j]);
            foundexpired = true;
            break;
        }
    }
        // If the date is not found, add 0 to the array
        if (!foundexited) {
          exited.push(0);
        }
        if (!foundcanceled) {
          canceled.push(0);
        }
        if (!foundexpired) {
          expired.push(0);
        }
      }

      
      //end
      var ctx = chart.getContext("2d");
      var myChart = new Chart(ctx, {
        type: "line",
        data: 
        {
          labels: dates,
          datasets: [
            {
              label: "Done",
              data: exited,
              backgroundColor: [
              
                "rgb(3, 201, 136)",
              ],
              borderColor: [
               
                "rgb(3, 201, 136)",
              ],
              borderWidth: 1,
            },
            {
              label: "Canceled",
              data: canceled,
              backgroundColor: [
            
                "rgb(255, 0, 50)",
              ],
              borderColor: [
               
                "rgb(255, 0, 50)",
              ],
              borderWidth: 1,
            },
            {
              label: "Expired",
              data: expired,
              backgroundColor: [
              
               "rgb(107, 114, 142)"
              ],
              borderColor: [
               
                "rgb(107, 114, 142)"
              ],
              borderWidth: 1,
            },
          ],
        },
       
      });
      // else end
    }
  });
});

$(document).ready(function () {
  $(".data-table").each(function (_, table) {
    $(table).DataTable();
  });
});
