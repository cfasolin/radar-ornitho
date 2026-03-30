import * as Location from 'expo-location';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  const [milieu, setMilieu] = useState(null);
  const [coords, setCoords] = useState(null);
  const [loading, setLoading] = useState(false);

  // Traduction classes WorldCover → milieu
  function classToMilieu(code) {
    if (code === 10) return 'Forêt dense';
    if (code === 20) return 'Fourrés / arbustes';
    if (code === 30) return 'Prairie';
    if (code === 40) return 'Cultures';
    if (code === 50) return 'Urbain';
    if (code === 80) return 'Plan d’eau';
    if (code === 90) return 'Zone humide';
    return 'Inconnu';
  }

  // Espèces par milieu
  function getEspeces(m) {
    if (m === 'Forêt dense')
      return ['Pouillot siffleur', 'Pic noir', 'Roitelet huppé'];

    if (m === 'Prairie')
      return ['Alouette des champs', 'Tarier pâtre', 'Bruant jaune'];

    if (m === 'Zone humide')
      return ['Rousserolle effarvatte', 'Héron cendré', 'Canard colvert'];

    if (m === 'Plan d’eau')
      return ['Grèbe huppé', 'Foulque macroule', 'Sarcelle d’hiver'];

    if (m === 'Fourrés / arbustes')
      return ['Fauvette grisette', 'Linotte mélodieuse'];

    return [];
  }

  async function scanLocation() {
    setLoading(true);

    // Permission GPS
    const { status } =
      await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      alert('Permission GPS refusée');
      setLoading(false);
      return;
    }

    // Récupère position
    const location = await Location.getCurrentPositionAsync({});
    setCoords(location.coords);

    try {
      // Appel proxy WorldCover
      const response = await fetch(
        'http://192.168.1.11:3000/worldcover?lat=' +
          location.coords.latitude +
          '&lon=' +
          location.coords.longitude
      );

      const data = await response.json();

      const milieuDetecte = classToMilieu(data.class);
      setMilieu(milieuDetecte);

    } catch (error) {
      alert('Erreur connexion proxy');
      console.log(error);
    }

    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Radar ornithologique</Text>

      <Pressable style={styles.button} onPress={scanLocation}>
        <Text style={styles.buttonText}>Scanner ici</Text>
      </Pressable>

      {loading && <Text>Analyse occupation des sols…</Text>}

      {coords && (
        <Text style={styles.coords}>
          {coords.latitude.toFixed(3)} /{' '}
          {coords.longitude.toFixed(3)}
        </Text>
      )}

      {milieu && (
        <View style={styles.result}>
          <Text style={styles.subtitle}>
            Milieu détecté : {milieu}
          </Text>

          {getEspeces(milieu).map((oiseau, index) => (
            <Text key={index}>• {oiseau}</Text>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8f2ee',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1f4d3a',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#2f6f55',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  coords: {
    marginTop: 20,
    fontSize: 12,
    color: '#555',
  },
  result: {
    marginTop: 20,
    alignItems: 'center',
  },
  subtitle: {
    fontWeight: 'bold',
    marginBottom: 10,
  },
});
