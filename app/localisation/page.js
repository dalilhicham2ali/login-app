'use client';
import { useEffect, useState } from 'react';
import Script from 'next/script';

export default function Localisation() {
  const [position, setPosition] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [address, setAddress] = useState('');

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const newPosition = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          };
          setPosition(newPosition);
        },
        (error) => {
          console.error('Erreur de géolocalisation:', error);
        },
        { enableHighAccuracy: true } // Activer la haute précision
      );
    }
  }, []);

  useEffect(() => {
    if (position && mapLoaded && !map) {
      // Initialiser la carte
      const mapInstance = new window.google.maps.Map(document.getElementById('map'), {
        center: position,
        zoom: 17, // Zoom plus proche pour voir plus de détails
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
        zoomControl: true
      });

      // Créer un marqueur personnalisé avec une info-bulle
      const markerInstance = new window.google.maps.Marker({
        position: position,
        map: mapInstance,
        title: 'Votre position',
        animation: window.google.maps.Animation.DROP // Animation de chute pour le marqueur
      });

      // Créer une info-bulle
      const infoWindow = new window.google.maps.InfoWindow();

      // Utiliser le Geocoder pour obtenir l'adresse
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: position }, (results, status) => {
        if (status === 'OK' && results[0]) {
          const address = results[0].formatted_address;
          setAddress(address);
          
          // Définir le contenu de l'info-bulle
          infoWindow.setContent(`
            <div style="padding: 10px;">
              <h3 style="margin: 0 0 5px 0; color: #1a73e8;">Votre position actuelle</h3>
              <p style="margin: 0; font-size: 14px;">${address}</p>
              <p style="margin: 5px 0 0 0; font-size: 12px; color: #666;">
                Lat: ${position.lat.toFixed(6)}<br>
                Lng: ${position.lng.toFixed(6)}
              </p>
            </div>
          `);
          
          // Ouvrir l'info-bulle au chargement
          infoWindow.open(mapInstance, markerInstance);
        }
      });

      // Ajouter un écouteur de clic sur le marqueur
      markerInstance.addListener('click', () => {
        infoWindow.open(mapInstance, markerInstance);
      });

      // Ajouter un cercle pour montrer la précision approximative
      new window.google.maps.Circle({
        map: mapInstance,
        center: position,
        radius: 50, // Rayon en mètres
        fillColor: '#1a73e8',
        fillOpacity: 0.1,
        strokeColor: '#1a73e8',
        strokeOpacity: 0.3,
        strokeWeight: 1
      });

      setMap(mapInstance);
      setMarker(markerInstance);
    }
  }, [position, mapLoaded, map]);

  return (
    <div className="p-4">
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=AIzaSyBj9J6-oaIdRW_-lgKLWuVpX3PeSB2oaLM&libraries=places,geometry`}
        onLoad={() => setMapLoaded(true)}
      />
      <h1 className="text-2xl font-bold mb-4">Ma Localisation</h1>
      {address && (
        <div className="mb-4 p-4 bg-white rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Adresse actuelle :</h2>
          <p className="text-gray-600">{address}</p>
        </div>
      )}
      <div 
        id="map" 
        style={{ 
          height: '500px', 
          width: '100%',
          border: '1px solid #ddd',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}
      >
        {!position && (
          <div className="flex items-center justify-center h-full bg-gray-50">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
              <p>Chargement de la localisation...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
