﻿define(['async!//maps.google.com/maps/api/js?sensor=false', 'underscore', 'jquery', 'signalr.hubs', 'riderTime'], function (googleMaps, _, $, hubs, RiderTime) {

	var eventSlug = null;
	var riderSlug = null;

	function initialize() {

		// retrieve basic information about the event rider (map default location and zoom, and marker default location)
		$.getJSON('/api/v1/events/' + eventSlug + '/riders/' + riderSlug + '/').done(function (rider) {

			var riderTime = new RiderTime(rider);

			var mapOptions = {
				center: { lat: rider.MapLatitude, lng: rider.MapLongitude },
				zoom: rider.MapZoom,
				mapTypeId: google.maps.MapTypeId.ROADMAP,
				scrollwheel: false
			};

			var map = new google.maps.Map(document.getElementById('map-canvas'),
				mapOptions);

			var marker = new google.maps.Marker({
				position: { lat: rider.MarkerLatitude, lng: rider.MarkerLongitude },
				map: map
			});

			// retrieve the routes associated with this rider
			$.getJSON('/api/v1/events/' + eventSlug + '/riders/' + riderSlug + '/routes').done(function (routes) {

				var lines = [];

				// a rider may be riding on multiple routes throughout a race
				for (var i = 0; i < routes.length; i++) {

					var route = routes[i];

				    // create a line for this route and draw it on the map
					if (route.UnvisitedVertices != null && route.VisitedVertices != null)
					{
					    var line = new google.maps.Polyline({
					        path: _.map(route.UnvisitedVertices, function (vertex) { return new google.maps.LatLng(vertex.Latitude, vertex.Longitude); }),
					        geodisc: true,
					        strokeColor: route.Color,
					        strokeOpacity: 1.0,
					        strokeWeight: 3
					    });

					    line.setMap(map);

					    lines.push(line);

					    var line = new google.maps.Polyline({
					        path: _.map(route.VisitedVertices, function (vertex) { return new google.maps.LatLng(vertex.Latitude, vertex.Longitude); }),
					        geodisc: true,
					        strokeColor: "#0000FF",
					        strokeOpacity: 1.0,
					        strokeWeight: 3
					    });

					    line.setMap(map);

					    lines.push(line);
					} else {
					    var line = new google.maps.Polyline({
					        path: _.map(route.Vertices, function (vertex) { return new google.maps.LatLng(vertex.Latitude, vertex.Longitude); }),
					        geodisc: true,
					        strokeColor: route.Color,
					        strokeOpacity: 1.0,
					        strokeWeight: 3
					    });

					    line.setMap(map);

					    lines.push(line);
					}

				}
			});

			// update the marker location with the rider's last known position.
			$.getJSON('/api/v1/events/' + eventSlug + '/riders/' + riderSlug + '/location').done(function (location) {

				if (!location) {
					return;
				}

				marker.setPosition({ lat: location.Latitude, lng: location.Longitude });

				$('.travelled .miles .counter').html(location.TotalMiles.toFixed(2));
			});

			// start listening for location updates
			var locationHub = $.connection.eventRiderLocationHub;
			var messageHub = $.connection.eventRiderMessageHub;

			$.connection.hub.logging = true;

			locationHub.client.updateLocation = function (location) {

			    if (location.EventRiderID !== rider.EventRiderID) {
			        return;
			    }

				marker.setPosition({ lat: location.Latitude, lng: location.Longitude });

				$('.travelled .miles .counter').html(location.TotalMiles.toFixed(2));

			};

			messageHub.client.addRecentMessage = function (message) {

				if (message.EventRiderID !== rider.EventRiderID) {
					return;
				}

				var recentMessages = $('.recent-messages');

				recentMessages.find('.no-messages').remove();

				var existingMessages = recentMessages.find('.messages .message');

				if (existingMessages.length === 5) {

					existingMessages.last().remove();
				}

				$('.recent-messages .messages').prepend('<div class="message"><div class="post">' + message.Text + '</div><div class="author">' + message.Sender + '</div></div>');
			};

			$.connection.hub.start();

		});
	}

	return {
		setup: function (event, rider) {

			eventSlug = event;
			riderSlug = rider;

			$(function () {
				initialize();
			});

		}
	};

});