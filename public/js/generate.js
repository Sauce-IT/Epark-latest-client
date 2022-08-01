





    var booking_id = document.getElementById('booking_id').value;

    var url = "https://chart.googleapis.com/chart?cht=qr&chs=200x200&chl=booking_id:" +  booking_id ;
    
    console.log('booking_id:' + booking_id );
    
    var ifr = `<iframe src="${url}" height="200" width="200"></iframe>`;

    document.getElementById('qrcode').innerHTML = ifr;
