import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from './config/supabase'
import { useAuth } from './contexts/AuthContext'
import Header from './components/Header'
import MapView from './components/MapView'
import AddPlaceModal from './components/AddPlaceModal'
import LoadingSpinner from './components/LoadingSpinner'
import toast from 'react-hot-toast'

function App() {
  const { user } = useAuth()
  const [places, setPlaces] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [selectedPlace, setSelectedPlace] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  // Charger les lieux au démarrage
  useEffect(() => {
    fetchPlaces()
  }, [])

  const fetchPlaces = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('places')
        .select(`
          *,
          profiles:author_id (
            display_name,
            email
          )
        `)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching places:', error)
        toast.error('Erreur lors du chargement des lieux')
        return
      }

      // Mapper les données pour inclure le nom de l'auteur
      const mappedPlaces = data.map(place => ({
        ...place,
        author_name: place.profiles?.display_name || place.profiles?.email?.split('@')[0] || 'Anonyme'
      }))

      setPlaces(mappedPlaces)
    } catch (error) {
      console.error('Error:', error)
      toast.error('Erreur lors du chargement des lieux')
    } finally {
      setLoading(false)
    }
  }

  const handleAddPlace = () => {
    if (!user) {
      toast.error('Connectez-vous pour ajouter un lieu')
      return
    }
    setShowAddModal(true)
    setSelectedLocation(null)
  }

  const handleLocationSelect = (location) => {
    setSelectedLocation(location)
  }

  const handleSubmitPlace = async (placeData) => {
    if (!user) {
      toast.error('Vous devez être connecté pour ajouter un lieu')
      return
    }

    try {
      setSubmitting(true)
      
      const { data, error } = await supabase
        .from('places')
        .insert([
          {
            ...placeData,
            author_id: user.id
          }
        ])
        .select()

      if (error) {
        console.error('Error adding place:', error)
        toast.error('Erreur lors de l\'ajout du lieu')
        return
      }

      toast.success('Lieu ajouté avec succès ! 🎉')
      setShowAddModal(false)
      setSelectedLocation(null)
      
      // Recharger les lieux
      await fetchPlaces()
      
    } catch (error) {
      console.error('Error:', error)
      toast.error('Erreur lors de l\'ajout du lieu')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-lg text-gray-600">Chargement de GeoLoc...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onAddPlace={handleAddPlace} />
      
      <main className="relative">
        {/* Section Hero */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-600 text-white py-16"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-4xl md:text-6xl font-bold mb-6"
            >
              Découvrez & Partagez
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-xl md:text-2xl text-primary-100 mb-8"
            >
              Les meilleurs lieux de divertissement et de restauration
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              {user ? (
                <button
                  onClick={handleAddPlace}
                  className="bg-white text-primary-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg"
                >
                  🎯 Ajouter un lieu
                </button>
              ) : (
                <p className="text-primary-100">
                  Connectez-vous pour commencer à partager vos lieux favoris
                </p>
              )}
            </motion.div>
          </div>
        </motion.section>

        {/* Section Carte */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="mb-6"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Explorez la carte
              </h2>
              <p className="text-gray-600">
                {places.length} lieu{places.length > 1 ? 's' : ''} partagé{places.length > 1 ? 's' : ''} par la communauté
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
              style={{ height: '600px' }}
            >
              <MapView
                places={places}
                onLocationSelect={showAddModal ? handleLocationSelect : null}
                newPlacePosition={selectedLocation}
                selectedPlace={selectedPlace}
                onPlaceSelect={setSelectedPlace}
              />
            </motion.div>
          </div>
        </section>

        {/* Stats */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="py-16 bg-white"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="p-6">
                <div className="text-4xl font-bold text-primary-600 mb-2">
                  {places.length}
                </div>
                <div className="text-gray-600">Lieux partagés</div>
              </div>
              <div className="p-6">
                <div className="text-4xl font-bold text-secondary-600 mb-2">
                  {places.reduce((acc, place) => acc + (place.rating || 0), 0) / places.length || 0}
                </div>
                <div className="text-gray-600">Note moyenne</div>
              </div>
              <div className="p-6">
                <div className="text-4xl font-bold text-emerald-600 mb-2">
                  {new Set(places.map(place => place.author_id)).size}
                </div>
                <div className="text-gray-600">Contributeurs</div>
              </div>
            </div>
          </div>
        </motion.section>
      </main>

      {/* Modal d'ajout de lieu */}
      <AddPlaceModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false)
          setSelectedLocation(null)
        }}
        onSubmit={handleSubmitPlace}
        selectedLocation={selectedLocation}
        loading={submitting}
      />
    </div>
  )
}

export default App