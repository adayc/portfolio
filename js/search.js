
// Cargamos el mapa cuando cargue la página
var myLocation;
  
var initMap = (function() {
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -34.397,
      lng: 150.644},
    zoom: 14
  });
  var infoWindow = new google.maps.InfoWindow({map: map});
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      myLocation = pos;
      infoWindow.setPosition(pos);
      infoWindow.setContent('Location found.');
      var thisPlace = new google.maps.LatLng(myLocation.lat, myLocation.lng);
      var service = new google.maps.places.PlacesService(map);
      service.nearbySearch({
        location: thisPlace,
        radius: 1500,
        type: ['food']
      }, callback);
      function callback(results, status) {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          for (var i = 0; i < results.length; i++) {
            createMarker(results[i]);
          }
        }
      };
      function createMarker(thisPlace) {
        var placeLoc = thisPlace.geometry.location;
        var marker = new google.maps.Marker({
          map: map,
          position: thisPlace.geometry.location
        });
        google.maps.event.addListener(marker, 'click', function() {
          infoWindow.setContent(thisPlace.name);
          infoWindow.open(map, this);
        });
      };
  
      map.setCenter(pos);
    }, function() {
      handleLocationError(true, infoWindow, map.getCenter());
    });
  } else {
    handleLocationError(false, infoWindow, map.getCenter());
  }
});
  
var handleLocationError = (function(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(browserHasGeolocation ?
    'Error: The Geolocation service failed.' :
    'Error: Your browser doesn\'t support geolocation.');
});

$(document).ready(function() {
  // Creamos el array para cargar los tipos de comida
  var kindOfFood = [];
  // Añadimos al array todos los elementos que se encuentran en el atributo 'kind' del objeto
  for (i = 0;i < restaurants.length;i++) {
    newKind = restaurants[i]['kind'];
    kindOfFood.push(newKind);
  }
  // Creamos una función para eliminar elementos duplicados

  Array.prototype.unique = function() {
    var el = this.concat().sort();
    for (var i = 1; i < el.length;) {
      if (el[i - 1] === el[i])
        el.splice(i, 1);
      else
        i++;
    }
    return el;
  };

  var arrKindOfFood = kindOfFood.unique();
  // Añadimos todos los option con los values en el dataist
   
  for (var i = 0; i < arrKindOfFood.length; i++) {
    var $option = $('<option value="' + arrKindOfFood[i] + '"></option>');  
    $('#kind-of-food').append($option);
  }

  // Deshabilitamos el boton de búsqueda al cargar la página
  $('#btn-search').prop('disabled', true);

  // Deshabilitamos el botón de búsqueda cuando se ingrese algún valor al input
  $('#list-kind-of-food').on('input', function() {
    if ($('#list-kind-of-food').val().length === 0) {
      $('#btn-search').prop('disabled', true);
    } else {
      $('#btn-search').prop('disabled', false);
    }
  });

  $('#btn-search').on('click', function() {
    $('#results').children().remove();
    var filterSearch = $('#list-kind-of-food').val();
    for (var i = 0; i < restaurants.length; i++) {
      if (restaurants[i]['kind'] == filterSearch) {
        var image = restaurants[i]['image'];
        

        var $newImg = ('<div class="container-img"><p class="overlay-title">' + restaurants[i]['name'] + '</p> <img class="img-food margin-top" src="../assets/images/' + restaurants[i]['image'] + '" alt="' + restaurants[i]['name'] + '"></div></div>');

        $('#results').append($newImg);
      }
    };

    // Efecto mouseover
    $('.container-img').mouseover(function() {
      $(':nth-child(1)', this).css({'opacity': '1'});
    });

    $('.container-img').mouseout(function() {
      $(':nth-child(1)', this).css({'opacity': '0'});
    });

    $('.container-img').on('click', function() {
      var place = $(this).children('img').attr('alt');
     
      for (var i = 0; i < restaurants.length; i++) {
        if (place == restaurants[i]['name']) {
          // Obtenemos los datos
          $('#title-modal').empty();
          $('#modal-data').empty();
          $('#title-modal').html(restaurants[i]['name']);
          $('#modal-map').empty();
          $('#modal-map').append(restaurants[i]['iframe']);
            
          $('#modal-data').append('<p>Dirección:' + restaurants[i]['addres'] + '</p>');
          $('#modal-data').append('<p>Aforo:' + restaurants[i]['aforo'] + '</p>');
          $('#modal-data').append('<p>Formas de pago:' + restaurants[i]['payment'] + '</p>');
          $('#modal-data').append('<p>Se aceptan mascotas:' + restaurants[i]['petfriendly'] + '</p>');
          
          $('#modal-data').append('<p><a href="' + restaurants[i]['website'] + '">' + restaurants[i]['website'] + '</a></p>');
        }
      }
      
      // Aparece el modal
      $('#modal').modal('show');
    });
  });
});

