
var pos;

function createTableRow(atmList, location) {
    var lat = location.geometry.location.lat();
    var lng = location.geometry.location.lng();

    var p1 = new google.maps.LatLng(pos.lat, pos.lng);
    var p2 = new google.maps.LatLng(lat, lng);
    var distanceFromCurrentPosition = parseInt(google.maps.geometry.spherical.computeDistanceBetween(p1, p2));

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

        var mapElem = document.getElementById('map').setAttribute('src', googleMapsUrl);
    };
};

function truncateTable() {
    var table = document.getElementById('atms-list');
    var trElems = table.querySelectorAll('tr');

    for (var i = 1; i < trElems.length; i++) {
        table.removeChild(trElems[i]);
    }
}

function getAtms(filterName) {
    truncateTable();

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {

            pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            /* Get map object to pass to places API search */
            var map = new google.maps.Map(document.getElementById('map'), {
                center: pos,
                zoom: 15
            });

            /* Get places API search service */
            var searchParams = {
                location: pos,
                rankBy: google.maps.places.RankBy.DISTANCE,
                type: ['atm']
            };

            if (filterName !== undefined && filterName != '') {
                searchParams.name = 'Telenor';
            }

            var service = new google.maps.places.PlacesService(map);
            service.nearbySearch(searchParams, callback);

            /* Places API search callback function */
            function callback(results, status) {
                var atmList = document.getElementById("atms-list");

                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    for (var i = 0; i < results.length; i++) {
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

window.onload = function () {
    document.getElementById('multi-currency').onclick = function(e) {
        var filterName = '';
        if (e.target.checked) {
            filterName = 'Telenor';    
        }

        getAtms(filterName);
    }
}
