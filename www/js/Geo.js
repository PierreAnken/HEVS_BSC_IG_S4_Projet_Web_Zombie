class Geo {

    static getUserPos(){
        if (navigator.geolocation) {
           let latlng;
            navigator.geolocation.getCurrentPosition(function(position) {
                 latlng = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
               Geo.getCountry(latlng);
            });

        } else {
            console.log("Unable to get user position");
        }
    }

    static getCountry(latlng){

        new google.maps.Geocoder().geocode({'latLng' : latlng}, function(results, status) {
            if (status === google.maps.GeocoderStatus.OK) {
                if (results[1]) {
                    let country = null, countryCode = null;
                    let c, lc, component;
                    for (let r = 0, rl = results.length; r < rl; r += 1) {
                        let result = results[r];
                         if (!country && result.types[0] === 'country') {
                            country = result.address_components[0].long_name;
                            countryCode = result.address_components[0].short_name;
                        }

                        if (country) {
                            break;
                        }
                    }

                    if(country !== null){
                        if (typeof(Storage) !== "undefined") {
                              sessionStorage.setItem("userCountry", country +"("+countryCode+")");
                        }
                    }
                }
            }
        });
    }
}