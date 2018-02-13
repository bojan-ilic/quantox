var pos;

function createTableRow(atmList, location) {
    var lat = location.geometry.location.lat();
    var lng = location.geometry.location.lng();

    var p1 = new google.maps.LatLng(pos.lat, pos.lng);
    var p2 = new google.maps.LatLng(lat, lng);

    var distanceFromCurrentPosition = parseInt(google.maps.geometry.spherical.computeDistanceBetween(p1, p2));
    console.log(distanceFromCurrentPosition);

    var tr = document.createElement("tr");

    var td1 = document.createElement("td");
    td1.textContent = location.name;
    tr.appendChild(td1);

    var td2 = document.createElement("td");
    td2.textContent = distanceFromCurrentPosition + "m";
    tr.appendChild(td2);

    atmList.appendChild(tr);

    td1.onclick = function() {
        var coords = lat + ',' + lng;
        var googleMapsUrl = 'https://maps.googleapis.com/maps/api/staticmap?center='
            + coords + '&zoom=12&size=400x400&markers=' + coords + '&key=AIzaSyCkhS15LF5JMTGf5uzzmPPzy7ndseLvMjI';
//console.log(googleMapsUrl);
        var mapElem = document.getElementById('map').setAttribute('src', googleMapsUrl);
    };
};

function getAtms() {
    console.log('pozvana funkcija getAtms');

    /* trenutna lokacija*/
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {

            pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            /*console.log(pos);*/
            /* objekat mape da bih pozvao google map api*/
            var map = new google.maps.Map(document.getElementById('map'), {
                center: pos,
                zoom: 15
            });
            /* definisemo servis za trazenje*/
            var service = new google.maps.places.PlacesService(map);
            service.nearbySearch({
                location: pos,
                rankBy: google.maps.places.RankBy.DISTANCE,
                type: ['atm']
            }, callback);
            /* */
            function callback(results, status) {
                console.log('Broj rezultata: ', results.length);
                console.log('Response status: ', status);
                console.log('Sadrzaj results niza: ', results);
                var atmList = document.getElementById("atms-list");
                // console.log(results, status);
                if (status === google.maps.places.PlacesServiceStatus.OK) { // if (status === 'OK')
                    for (var i = 0; i < results.length; i++) {
                        //console.log(results[i].geometry.location.lat());
                        createTableRow(atmList, results[i]);
                        if (i == 9) {
                            break;
                        }
                    }
                }

            }
        });
    }
}
