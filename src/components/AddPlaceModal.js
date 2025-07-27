import React, { useState, useRef } from 'react'
import { X, MapPin, Camera, Upload, Star } from 'lucide-react'
import { PLACE_TYPES } from '../config/supabase'
import LoadingSpinner from './LoadingSpinner'
import toast from 'react-hot-toast'

const AddPlaceModal = ({ isOpen, onClose, onSubmit, selectedLocation, loading }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'restaurant',
    rating: 5,
    address: ''
  })
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const fileInputRef = useRef(null)
  const cameraInputRef = useRef(null)

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('L\'image ne doit pas dépasser 5MB')
        return
      }
      
      const reader = new FileReader()
      reader.onloadend = () => {
        setImage(reader.result)
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCameraCapture = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImage(reader.result)
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!selectedLocation) {
      toast.error('Veuillez sélectionner un emplacement sur la carte')
      return
    }

    const placeData = {
      ...formData,
      latitude: selectedLocation.lat,
      longitude: selectedLocation.lng,
      image: image
    }

    await onSubmit(placeData)
    
    // Reset form
    setFormData({
      name: '',
      description: '',
      type: 'restaurant',
      rating: 5,
      address: ''
    })
    setImage(null)
    setImagePreview(null)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-slide-up">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl">
          <h2 className="text-2xl font-bold text-gray-900">
            Ajouter un lieu
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Location info */}
          {selectedLocation && (
            <div className="bg-primary-50 p-4 rounded-xl border border-primary-100">
              <div className="flex items-center gap-2 text-primary-700">
                <MapPin className="w-5 h-5" />
                <span className="font-medium">
                  Position: {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
                </span>
              </div>
            </div>
          )}

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Photo du lieu
            </label>
            <div className="space-y-4">
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Aperçu"
                    className="w-full h-48 object-cover rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImage(null)
                      setImagePreview(null)
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-primary-500 hover:bg-primary-50 transition-colors"
                  >
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600">Galerie</span>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => cameraInputRef.current?.click()}
                    className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-primary-500 hover:bg-primary-50 transition-colors"
                  >
                    <Camera className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600">Caméra</span>
                  </button>
                </div>
              )}
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleCameraCapture}
                className="hidden"
              />
            </div>
          </div>

          {/* Nom du lieu */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom du lieu *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="input-field"
              placeholder="Ex: Restaurant Le Petit Paris"
              required
            />
          </div>

          {/* Type de lieu */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type de lieu *
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="input-field"
              required
            >
              {PLACE_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Note */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Votre note
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => setFormData({ ...formData, rating })}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-8 h-8 ${
                      rating <= formData.rating
                        ? 'text-yellow-500 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm text-gray-600">
                ({formData.rating}/5)
              </span>
            </div>
          </div>

          {/* Adresse */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Adresse
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="input-field"
              placeholder="Ex: 123 Rue de la Paix, Paris"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="input-field h-24 resize-none"
              placeholder="Partagez votre expérience, ce qui rend ce lieu spécial..."
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1"
              disabled={loading}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="btn-primary flex-1 flex items-center justify-center"
              disabled={loading || !selectedLocation}
            >
              {loading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  <MapPin className="w-5 h-5 mr-2" />
                  Ajouter le lieu
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddPlaceModal