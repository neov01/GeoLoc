import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet'
import { Icon } from 'leaflet'
import { MapPin, Star, Clock, User, MessageCircle } from 'lucide-react'
import { getPlaceTypeInfo } from '../config/supabase'

// Configuration des icônes Leaflet
delete Icon.Default.prototype._getIconUrl
Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

// Composant pour créer un nouveau lieu
const LocationMarker = ({ onLocationSelect, newPlacePosition }) => {
  const [position, setPosition] = useState(null)

  useMapEvents({
    click(e) {
      setPosition(e.latlng)
      onLocationSelect && onLocationSelect(e.latlng)
    },
  })

  return newPlacePosition === null ? null : (
    <Marker 
      position={newPlacePosition}
      icon={new Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      })}
    >
      <Popup>
        <div className="text-center">
          <MapPin className="w-5 h-5 text-red-500 mx-auto mb-2" />
          <p className="font-medium">Nouveau lieu</p>
          <p className="text-sm text-gray-600">Cliquez sur "Ajouter un lieu" pour le créer</p>
        </div>
      </Popup>
    </Marker>
  )
}

const MapView = ({ 
  places = [], 
  onLocationSelect, 
  newPlacePosition, 
  selectedPlace,
  onPlaceSelect,
  center = [48.8566, 2.3522] // Paris par défaut
}) => {
  const [map, setMap] = useState(null)

  // Centrer sur un lieu sélectionné
  useEffect(() => {
    if (map && selectedPlace) {
      map.setView([selectedPlace.latitude, selectedPlace.longitude], 15)
    }
  }, [map, selectedPlace])

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating)
            ? 'text-yellow-500 fill-current'
            : 'text-gray-300'
        }`}
      />
    ))
  }

  return (
    <div className="h-full w-full relative">
      <MapContainer
        center={center}
        zoom={13}
        className="h-full w-full"
        ref={setMap}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Marker pour sélectionner un nouveau lieu */}
        <LocationMarker 
          onLocationSelect={onLocationSelect}
          newPlacePosition={newPlacePosition}
        />
        
        {/* Markers des lieux existants */}
        {places.map((place) => {
          const typeInfo = getPlaceTypeInfo(place.type)
          
          return (
            <Marker
              key={place.id}
              position={[place.latitude, place.longitude]}
              eventHandlers={{
                click: () => onPlaceSelect && onPlaceSelect(place)
              }}
            >
              <Popup className="custom-popup">
                <div className="p-2 min-w-[250px]">
                  {/* Image */}
                  {place.image && (
                    <img
                      src={place.image}
                      alt={place.name}
                      className="w-full h-32 object-cover rounded-lg mb-3"
                    />
                  )}
                  
                  {/* Header */}
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">{place.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-1 rounded-full text-xs text-white ${typeInfo.color}`}>
                          {typeInfo.label}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Rating */}
                  {place.rating && (
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex">
                        {renderStars(place.rating)}
                      </div>
                      <span className="text-sm text-gray-600">
                        ({place.rating.toFixed(1)})
                      </span>
                    </div>
                  )}
                  
                  {/* Description */}
                  {place.description && (
                    <p className="text-gray-700 text-sm mb-3 line-clamp-3">
                      {place.description}
                    </p>
                  )}
                  
                  {/* Meta info */}
                  <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      <span>{place.author_name || 'Anonyme'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(place.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  {/* Bouton pour voir plus de détails */}
                  <button
                    onClick={() => onPlaceSelect && onPlaceSelect(place)}
                    className="w-full mt-3 bg-primary-500 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-primary-600 transition-colors"
                  >
                    Voir les détails
                  </button>
                </div>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>
      
      {/* Instructions pour ajouter un lieu */}
      {onLocationSelect && (
        <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-3 z-[1000]">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <MapPin className="w-4 h-4 text-primary-500" />
            <span>Cliquez sur la carte pour placer un nouveau lieu</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default MapView