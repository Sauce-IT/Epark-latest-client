function checkpass() {
  const url = "https://epark-project-api.herokuapp.com";

  var email = document.getElementById("email").value;
  var newp = document.getElementById("newPass").value;

  if (email == null || email == "") {
    document.getElementById("newPass").value = "Fill Up Email First";
  } else {
    fetch(url + "/forgotPass", {
      method: "POST",
      body: JSON.stringify({
        user_email: email,
      }),
    }).then(async function (response) {
      const res = await response.json();
      console.log(res);
      if (res.status["remarks"] === "failed") {
        document.getElementById("newPass").value = "Email Not Found!";
      } else {
        document.getElementById("newPass").value =
          "We sent an email with your new password";
        // document.getElementById("newPass").value = res.payload;
        // "We sent an email with your new password";
      }
    });
  }
}
