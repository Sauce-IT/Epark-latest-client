$(document).on("click", ".open-AddBookDialog", function () {
    var myBookId = $(this).data('id');
    $("#booking_id").val(myBookId);
   console.log(myBookId);

   var booking_id = document.getElementById('booking_id').value;

  var url = "https://chart.googleapis.com/chart?cht=qr&chs=200x200&chl=booking_id:" +  booking_id ;

  console.log('booking_id:' + booking_id );

  var ifr = `<center><img src="${url}" height="80%" width="80%"></img></center>`;

  document.getElementById('qrcode').innerHTML = ifr;
});
