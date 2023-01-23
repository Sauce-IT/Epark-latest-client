const express = require("express");
const router = express.Router();
const axios = require("axios").default;

const url = "https://epark-project-api.herokuapp.com";

sampledata = [
  {
    slot: "no data",
    availability: "no data",
  },
];
userbook = [];
sampledata2 = [];
rates = [];
// routes -------------------------------

// user route ==================================================================================
// --ok
router.get("/", (req, res) => {
  axios
    .post(url + "/getTodayBookings_copy")
    .then((response) => {
      if (response.data.status["remarks"] === "success") {
        const slot = response.data.payload;
        sampledata = slot;
        
        res.render("index", { slots: sampledata });
      } else {
        sampledata = sampledata;
        res.redirect("/home");
        console.log(error);
      }
    })
    .catch(function (error) {});
});

router.get("/getBooking", (req, res) => {
  axios
    .post(url + "/getBookinglist")
    .then((response) => {
      if (response.data.status["remarks"] === "success") {
        const slot = response.data.payload;
        sampledata = slot;
        

        res.render("getBooking_list", { slots: sampledata });
      } else {
        // res.redirect("/getBooking_list");
      }
    })
    .catch(function (error) {
      console.log(error);
    });
});

router.get("/user-login", (req, res) => {
  if (req.session.user) return res.redirect("/home");

  let message = req.session.message;
  let type = req.session.type;
  req.session = null;

  res.render("user-login", { message: message, type: type });
});

router.get("/logout", (req, res) => {
  req.session = null;

  res.redirect("/user-login");
});

router.get("/admin-logout", (req, res) => {
  req.session = null;

  res.redirect("/admin-login");
});

// --ok
router.get("/home", (req, res) => {
  if (!req.session.user) return res.redirect("/user-login");

  // get current rates
  axios
    .post(url + "/getRate")
    .then((response) => {
      // console.log(response);
      if (response.data.status["remarks"] === "success") {
        const rate = response.data.payload;
        rates = rate;
       
        
        // available today slot
        axios
          .post(url + "/allstatus")
          .then((response) => {
            if (response.data.status["remarks"] === "success") {
              const slot = response.data.payload;
            
              sampledata = slot;
              

              const data = JSON.stringify({
                id: req.session.user.id,
              });

              // get user booking info
              axios
                .post(url + "/getuserbook", data)
                .then((response) => {
                  if (response.data.status["remarks"] === "success") {
                    const book = response.data.payload;
                    userbook = book;

                   
                    // check user booking
                    for (var i = 0; i < book.length; i++) {
                      //check if the book is either paid or it is stil no expired
                      if (
                        book[i].book_status == "paid" ||
                        book[i].book_status != "expired"
                      ) {
                        var paid_date = new Date(book[i].paid_date);
                        var now = new Date();

                        //update book status if the aloted time overlap to the time givin
                        if (
                          now.getTime() > paid_date.getTime() + 180 * 60000 &&
                          book[i].date_entry == null
                        ) {
                          if (
                            book[i].book_status != "expired" &&
                            book[i].paid_date != null
                          ) {
                            const data = JSON.stringify({
                              booking_id: book[i].booking_id,
                              book_status: "expired",
                            });

                            axios
                              .post(url + "/updateBookingstatus", data)
                              .then((response) => {
                               
                              })
                              .catch(function (error) {
                                res.redirect("/user-login");
                              });
                          }
                        }

                        var date_created = new Date(book[i].date_created);

                        if (
                          now.getTime() > date_created.getTime() + 10 * 60000 &&
                          book[i].book_status == "unpaid"
                        ) {
                          const data = JSON.stringify({
                            booking_id: book[i].booking_id,
                            book_status: "expired",
                          });

                          axios
                            .post(url + "/updateBookingstatus", data)
                            .then((response) => {
                             
                            })
                            .catch(function (error) {
                              res.redirect("/user-login");
                            });
                        }
                      }
                    }
                  } else {
                    userbook = null;

                    console.log(error);
                  }

                  let message = req.session.errorReport;
                  req.session.errorReport = null;
                 

                  // navigation
                  res.render("main", {
                    slots: sampledata,
                    userbook: userbook,
                    rates: rates,
                    currentUsers: req.session.user,
                    errorreport: message,
                  });
                })
                .catch(function (error) {
                  let message = req.session.errorReport;
                  req.session.errorReport = null;
                  userbook = null;
                 
                  // navigation
                  res.render("main", {
                    slots: sampledata,
                    userbook: userbook,
                    rates: rates,
                    currentUsers: req.session.user,
                    errorreport: message,
                  });
                });
            } else {
              sampledata = sampledata;
              res.redirect("/home");
              console.log(error);
            }
          })
          .catch(function (error) {});
      } else {
        res.redirect("/home");
        console.log(error);
      }
    })
    .catch(function (error) {});
});

router.get("/login", (req, res) => {
  res.render("user-login");
});

router.get("/register", (req, res) => {
  let message = req.session.errorRegister;
  req.session = null;

  res.render("user-register", { errorRegister: message });
});

router.get("/user-profile", (req, res) => {
  if (!req.session.user) return res.redirect("/user-login");
  const data = JSON.stringify({
    user_id: req.session.user.id,
  });

  // get user info
  axios
    .post(url + "/getHistory",data)
    .then((response) => {
      if (response.data.status["remarks"] === "success") {
        const book = response.data.payload;
        userbook = book;
      
      } else {
        userbook = null;
        console.log(error);
      }

      res.render("user-profile", { currentUsers: req.session.user,userbook: userbook });

    })
    .catch(function (error) {
      userbook = null;
    });
});

// admin route ===================================================================================
router.get("/admin-login", (req, res) => {
  let message = req.session.message;
  req.session = null;

  res.render("adminclerk-login", { message: message });
});

router.get("/forgotPass", (req, res) => {
  res.render("forgotPass");
});

// --ok
router.get("/admin-dashboard", (req, res) => {
  if (!req.session.user) return res.redirect("/admin-login");
 

  //get parking slot
  axios
    .post(url + "/getSlot", sampledata)
    .then((response) => {
      if (response.data.status["remarks"] === "success") {
        const slot = response.data.payload;
        userbook = slot;

        // get all user
        axios
          .post(url + "/getAlluser", sampledata)
          .then((response) => {
            if (response.data.status["remarks"] === "success") {
              const slot = response.data.payload;
              sampledata = slot;
            

              // available today slot
              axios
                .post(url + "/getTodayBookings_copy", sampledata)
                .then((response) => {
                  if (response.data.status["remarks"] === "success") {
                    const slot = response.data.payload;
                    sampledata2 = slot;
                   
                    var pending = 0;
                    var reserved = 0;

                    axios
                    .post(url + "/getAllBookings")
                    .then((response) => {
                      if (response.data.status["remarks"] === "success") {
                        const data = response.data.payload;
                       
                        var currentDate = new Date();
                        data.forEach(element => {
                          if(element.date_created.slice(0,10) == currentDate.getFullYear() +"-"+ ('0' + (currentDate.getMonth()+1)).slice(-2) +"-"+ ('0' + currentDate.getDate()).slice(-2) ){
                            if(element.paid_date == null && element.book_status == "unpaid"){
                              pending = pending + 1;
                            }

                            if(element.paid_date != null){
                              reserved = reserved + 1;
                            }
                          }

                        });
                        
                        // getAllBookings
                      } else {
                        // sampledata = sampledata;
                        res.redirect("/home");
                        console.log(error);
                      }
    
                      // navigation
                      res.render("dashboard", {
                        slots: userbook,
                        users: sampledata,
                        available: sampledata2,
                        pending: pending,
                        reserved:reserved
                      });
                    })
                    
                    // 
                  } else {
                    // sampledata = sampledata;
                    res.redirect("/home");
                    console.log(error);
                  }

                })
                .catch(function (error) {});
            } else {
              // sampledata = sampledata;
              res.redirect("/home");
              console.log(error);
            }
          })
          .catch(function (error) {});
      } else {
        // sampledata = sampledata;
        res.redirect("/home");
        console.log(error);
      }
    })
    .catch(function (error) {});
});

// --ok
router.get("/manage-parking", (req, res) => {
  if (!req.session.user) return res.redirect("/admin-login");
  // get current rates
  axios
    .post(url + "/getRate", sampledata)
    .then((response) => {
      
      if (response.data.status["remarks"] === "success") {
        const rate = response.data.payload;
        rates = rate;
      

        // available today slot
        axios
          .post(url + "/allstatus")
          .then((response) => {
            if (response.data.status["remarks"] === "success") {
              const slot = response.data.payload;
              sampledata = slot;
              
             
               res.render("manage-parking", {
                parkings: sampledata,
                rates: rates,
                
                });

             

            } else {
              sampledata = sampledata;
              res.redirect("/home");
              console.log(error);
            }
           
          })
          .catch(function (error) {});
      } else {
        res.redirect("/home");
        console.log(error);
      }
    })
    .catch(function (error) {});
});

// --ok
router.get("/manage-booking", (req, res) => {
  if (!req.session.user) return res.redirect("/admin-login");

  // expiration get user booking info
  axios
    .post(url + "/getAllBookings")
    .then((response) => {
      if (response.data.status["remarks"] === "success") {
        const book = response.data.payload;
        sampledata = book;
        for (var i = 0; i < book.length; i++) {
          //check if the book is either paid or it is stil no expired
          if (
            book[i].book_status == "paid" ||
            book[i].book_status != "expired"
          ) {
            var paid_date = new Date(book[i].paid_date);
            var now = new Date();

            //update book status if the aloted time overlap to the time givin
            if (
              now.getTime() > paid_date.getTime() + 180 * 60000 &&
              book[i].date_entry == null
            ) {
              if (
                book[i].book_status != "expired" &&
                book[i].paid_date != null
              ) {
                const data = JSON.stringify({
                  booking_id: book[i].booking_id,
                  book_status: "expired",
                });

                axios
                  .post(url + "/updateBookingstatus", data)
                  .then((response) => {
                   
                  })
                  .catch(function (error) {
                    res.redirect("/user-login");
                  });
              }
            }
            var date_created = new Date(book[i].date_created);

            if (
              now.getTime() > date_created.getTime() + 10 * 60000 &&
              book[i].book_status == "unpaid"
            ) {
              const data = JSON.stringify({
                booking_id: book[i].booking_id,
                book_status: "expired",
              });

              axios
                .post(url + "/updateBookingstatus", data)
                .then((response) => {
                 
                })
                .catch(function (error) {
                  res.redirect("/user-login");
                });
            }
          }
        }

        // available today slot
        axios
          .post(url + "/getTodayBookings_copy")
          .then((response) => {
            if (response.data.status["remarks"] === "success") {
              const slot = response.data.payload;
              userbook = slot;

              // naviigation
              res.render("manage-booking", {
                allbooking: sampledata,
                slots: userbook,
              });
            } else {
              // sampledata = sampledata;
              res.redirect("/home");
              console.log(error);
            }
          })
          .catch(function (error) {});
      } else {
        userbook = null;
        res.redirect("/home");
        console.log(error);
      }
    })
    .catch(function (error) {
      userbook = null;
      res.render("manage-booking", {
        allbooking: [],
        slots: userbook,
      });
    });
});

// ok
router.get("/user-info", (req, res) => {
  if (!req.session.user) return res.redirect("/admin-login");

  // get employee info
  axios
    .post(url + "/getEmployee")
    .then((response) => {
      if (response.data.status["remarks"] === "success") {
        const book = response.data.payload;
        userbook = book;
        
      } else {
        userbook = sampledata;
        res.redirect("/home");
       
      }

      res.render("user-info", { employee: userbook });
    })
    .catch(function (error) {
      userbook = sampledata;
    });
});

router.get("/user-logs", (req, res) => {
  if (!req.session.user) return res.redirect("/admin-login");

  // All booking
  axios
    .post(url + "/getAllBookings")
    .then((response) => {
      
      if (response.data.status["remarks"] === "success") {
        const slot = response.data.payload;
        sampledata = slot;
       
      } else {
        sampledata = sampledata;
        res.redirect("/user-logs");
      }
      res.render("user-logs", { booking: sampledata });
    })
    .catch((error) => {
      console.log("error!", error);
      res.render("user-logs", { booking: [] });
    });
});

router.get("/settings", (req, res) => {
  if (!req.session.user) return res.redirect("/admin-login");
  res.render("settings");
});

// clerk route=================================================================================

// --ok
router.get("/clerk-profile", (req, res) => {
  if (!req.session.user) return res.redirect("/admin-login");
  
  res.render("clerk-profile", { currentUsers: req.session.user });
});

// --ok
router.get("/manage-booking-clerk", (req, res) => {
  if (!req.session.user) return res.redirect("/admin-login");

  // ===========================================================================Scanning=============
  // expiration get user booking info
  axios
    .post(url + "/getAllBookings")
    .then((response) => {
      if (response.data.status["remarks"] === "success") {
        const book = response.data.payload;
        sampledata = book;
       
        for (var i = 0; i < book.length; i++) {
          //check if the book is either paid or it is stil no expired
          if (
            book[i].book_status == "paid" ||
            book[i].book_status != "expired"
          ) {
            var paid_date = new Date(book[i].paid_date);
            var now = new Date();

            //update book status if the aloted time overlap to the time givin
            if (
              now.getTime() > paid_date.getTime() + 180 * 60000 &&
              book[i].date_entry == null
            ) {
              if (
                book[i].book_status != "expired" &&
                book[i].paid_date != null
              ) {
                const data = JSON.stringify({
                  booking_id: book[i].booking_id,
                  book_status: "expired",
                });

                axios
                  .post(url + "/updateBookingstatus", data)
                  .then((response) => {
                   
                  })
                  .catch(function (error) {
                    res.redirect("/user-login");
                  });
              }
            }
            var date_created = new Date(book[i].date_created);

            if (
              now.getTime() > date_created.getTime() + 10 * 60000 &&
              book[i].book_status == "unpaid"
            ) {
              const data = JSON.stringify({
                booking_id: book[i].booking_id,
                book_status: "expired",
              });

              axios
                .post(url + "/updateBookingstatus", data)
                .then((response) => {
                 
                })
                .catch(function (error) {
                  res.redirect("/user-login");
                });
            }
          }
        }

        // available today slot
        axios
          .post(url + "/getTodayBookings_copy")
          .then((response) => {
            if (response.data.status["remarks"] === "success") {
              const slot = response.data.payload;
              userbook = slot;

              // naviigation
              res.render("manage-booking-clerk", {
                allbooking: sampledata,
                slots: userbook,
              });
            } else {
              // sampledata = sampledata;
              res.redirect("/home");
              console.log(error);
            }
          })
          .catch(function (error) {});
      } else {
        userbook = null;
        res.redirect("/home");
        console.log(error);
      }
    })
    .catch(function (error) {
      userbook = null;
      res.render("manage-booking-clerk", {
        allbooking: [],
        slots: userbook,
      });
    });
});

// --ok
router.get("/manage-parking-clerk", (req, res) => {
  if (!req.session.user) return res.redirect("/admin-login");

  // get current rates
  axios
    .post(url + "/getRate")
    .then((response) => {
      // console.log(response);
      if (response.data.status["remarks"] === "success") {
        const rate = response.data.payload;
        rates = rate;
       

        // available today slot
        axios
          .post(url + "/allstatus")
          .then((response) => {
            if (response.data.status["remarks"] === "success") {
              const slot = response.data.payload;
              sampledata = slot;
             

              res.render("manage-parking-clerk", {
                parkings: sampledata,
                rates: rates,
              });
            } else {
              sampledata = sampledata;
              res.redirect("/home");
              console.log(error);
            }
          })
          .catch(function (error) {});
        // end available
      } else {
        res.redirect("/home");
        console.log(error);
      }
    })
    .catch(function (error) {});
});

module.exports = router;
