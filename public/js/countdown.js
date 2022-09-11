
var sec = 0;
var min = 0;

var book_s = document.getElementById("book_s").value;
var stop = false;
function stopcountdown(){
    stop = true;
}
function countdown(){
        if(book_s == 'paid'){  
            var counta = setInterval(function() {

                if(stop == true){
                    clearInterval(counta);
                    stop = false;
                }
                
                // var paid_date = new Date(document.getElementById("status").value).getTime();


                var paid_date = new Date(document.getElementById("status").value);
                var count = new Date(paid_date.getTime() + 60 * 60000);
                var now = new Date();
                var gap = (count-now);


                // container for 30 
               
                  var aw = gap;


                // reversing time takes 4 delay(idk if seconds) 
                
                if(now >= count)
                {
                    document.getElementById("counter").innerHTML = "00:00 (Expired)<br>New reservation will be available after refresh";
                    clearInterval(counta);
                }

                aw--;

                // var days = Math.floor(aw / (1000 * 60 * 60 * 24));
                var hours = Math.floor((aw % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                var minutes = Math.floor((aw % (1000 * 60 * 60)) / (1000 * 60));
                var seconds = Math.floor((aw % (1000 * 60)) / 1000);
                
                if(now <= count )
                {
                    document.getElementById("counter").innerHTML =  hours + ':' +  minutes + ":" + seconds ;
                }else{
                    min = 0;
                    sec = 0;
                    document.getElementById("counter").innerHTML = "00:00 (Expired)<br>New reservation will be available after refresh";

                }
                // console.log('countdown',count);

                
            });
            
        }else{
            
            clearInterval(counta);
        }    
}

// if(document.getElementById('').value != null)
// {

//     let date_ob = new Date();

//     // current date
//     // adjust 0 before single digit date
//     let date = ("0" + date_ob.getDate()).slice(-2);
    
//     // current month
//     let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    
//     // current year
//     let year = date_ob.getFullYear();
    
//     // current hours
//     let hours = date_ob.getHours();
    
//     // current minutes
//     let minutes = date_ob.getMinutes();
    
//     // current seconds
//     let seconds = date_ob.getSeconds();
    
//     // prints date & time in YYYY-MM-DD HH:MM:SS format
//     var now = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;


    
//     var paid_date = new Date(document.getElementById("status").value);
//     var count = new Date(paid_date.getTime() + (30 * 60000));;
    
// }