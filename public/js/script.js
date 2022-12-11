const barchart = document.querySelectorAll(".barchart");
// const url = "https://e-park.herokuapp.com";
const url = "https://epark-project-api.herokuapp.com";

const data = [];
const label = [];
const data1 = [];
const label1 = [];

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

      console.log(label);
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
                "rgba(255, 99, 132, 0.2)",
                "rgba(54, 162, 235, 0.2)",
                "rgba(255, 206, 86, 0.2)",
                "rgba(75, 192, 192, 0.2)",
                "rgba(153, 102, 255, 0.2)",
                "rgba(255, 159, 64, 0.2)",
              ],
              borderColor: [
                "rgba(255, 99, 132, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(255, 206, 86, 1)",
                "rgba(75, 192, 192, 1)",
                "rgba(153, 102, 255, 1)",
                "rgba(255, 159, 64, 1)",
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
        label1.push(count.paid_date);
        data1.push(count.total);
      });

      console.log(data);
      console.log(label);
      //end
      var ctx = chart.getContext("2d");
      var myChart = new Chart(ctx, {
        type: "line",
        data: {
          labels: label1,
          datasets: [
            {
              label: "Daily Earnings",
              data: data1,
              backgroundColor: [
                "rgba(255, 99, 132, 0.2)",
                "rgba(54, 162, 235, 0.2)",
                "rgba(255, 206, 86, 0.2)",
                "rgba(75, 192, 192, 0.2)",
                "rgba(153, 102, 255, 0.2)",
                "rgba(255, 159, 64, 0.2)",
              ],
              borderColor: [
                "rgba(255, 99, 132, 1)",
                "rgba(54, 162, 235, 1)",
                "rgba(255, 206, 86, 1)",
                "rgba(75, 192, 192, 1)",
                "rgba(153, 102, 255, 1)",
                "rgba(255, 159, 64, 1)",
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
                  return `\u20B1 ${value}.00`;
                }
              }
            },
          },
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
