function myFunction(){
    var r = document.getElementById("rate").value;
    var t = document.getElementById("time").value;

    var total_price = parseInt(t * r);

    var type = document.getElementById("type").value;
    
    document.getElementById("totalprice").value = total_price;
    
}