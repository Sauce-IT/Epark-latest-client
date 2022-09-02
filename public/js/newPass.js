function checkpass(){
    const url = "https://e-park-6.herokuapp.com";

    var email = document.getElementById('email').value;
    var newp = document.getElementById("newPass").innerHTML;
    console.log(email);
    //   // get data from database
      fetch(url + "/forgotPass", {
        method: "POST",
        body: JSON.stringify({
          user_email: email,
        }),
      }).then(async function (response) {
        const res = await response.json();
        if (res.status["remarks"] === "failed") {
          document.getElementById("newPass").innerHTML = "Email Not Found!";
        } else {

            if(email == null || email == ""){
                document.getElementById("newPass").innerHTML = "Fill Up Email First";
            }else{
                document.getElementById("newPass").innerHTML  = res.payload;
            }
        }
      });

    

}






















