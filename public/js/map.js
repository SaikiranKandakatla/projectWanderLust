let map_token=maptoken;
console.log(map_token);
var map = tt.map({
    key:map_token,
    container:"map",
    center:[79.3474,13.6833],
    zoom:12
})
let marker=new tt.Marker({color:"red"})
.setLanhLat([79.3474,13.6833])
.setPopup(new tt.Popup().setHtml("<h6><b>your desired location</b></h6>"))
.addTo(map);