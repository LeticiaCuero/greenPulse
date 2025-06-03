let map;
let marker;

document.addEventListener('DOMContentLoaded', function() {
    const initialPosition = [-15.7801, -47.9292];
    
    map = L.map('map').setView(initialPosition, 5);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
    }).addTo(map);
    
    map.on('click', function(e) {
        placeMarker(e.latlng);
    });

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                const pos = [position.coords.latitude, position.coords.longitude];
                map.setView(pos, 13);
            },
            function() {
                console.log("Geolocalização negada pelo usuário");
            }
        );
    }
    
    window.addEventListener('resize', function() {
        map.invalidateSize();
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                highlightTarget(targetElement);
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    const volunteerButtons = document.querySelectorAll('.volunteer-option');
    volunteerButtons.forEach(button => {
        button.addEventListener('click', function() {
            volunteerButtons.forEach(btn => btn.classList.remove('selected'));
            this.classList.add('selected');
        });
    });
});

function placeMarker(latlng) {
    if (marker) {
        marker.setLatLng(latlng);
    } else {
        marker = L.marker(latlng, {draggable: true}).addTo(map);
        marker.on('dragend', function() {
            updateCoordinates(marker.getLatLng());
        });
    }
    updateCoordinates(latlng);
}

function updateCoordinates(latlng) {
    document.getElementById("latitude").value = latlng.lat;
    document.getElementById("longitude").value = latlng.lng;
}

function highlightTarget(element) {
    setTimeout(() => {
        element.classList.add('highlight-target');
        setTimeout(() => {
            element.classList.remove('highlight-target');
        }, 1000);
    }, 500);
}
