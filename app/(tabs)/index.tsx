import * as Location from 'expo-location';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { speciesData } from '../../data/speciesData';

type Milieu =   
  | 'urbain'
  | 'urbain_vegetalise'
  | 'foret'
  | 'prairie'
  | 'prairie_arboree'
  | 'zone_humide'
  | 'plan_eau'
  | 'cultures'
  | 'fourres'
  | 'mosaique';

type Altitude = 'basse' | 'moyenne' | 'haute';
type Saison = 'printemps' | 'ete' | 'automne' | 'hiver';
type Mode = 'manuel' | 'gps';

export default function HomeScreen() {
  const [mode, setMode] = useState<Mode>('manuel');
  const [milieu, setMilieu] = useState<Milieu>('urbain');
  const [altitude, setAltitude] = useState<Altitude>('basse');
  const [saison, setSaison] = useState<Saison>('printemps');
  const [coords, setCoords] = useState<Location.LocationObjectCoords | null>(null);
  const [loading, setLoading] = useState(false);

  function getSpecies(m: Milieu, a: Altitude, s: Saison): string[] {
    return (speciesData as any)[m]?.[a]?.[s] || [];
  }

  async function scanLocation() {
    setLoading(true);

    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      alert('Permission GPS refusée');
      setLoading(false);
      return;
    }

    const location = await Location.getCurrentPositionAsync({});
    setCoords(location.coords);

    try {
      const response = await fetch(
        'http://192.168.1.11:3000/worldcover?lat=' +
          location.coords.latitude +
          '&lon=' +
          location.coords.longitude
      );

      const data = await response.json();

      const milieuDetecte = data.habitat as Milieu;

      setMilieu(milieuDetecte);
    } catch (error) {
      alert('Erreur connexion proxy');
      console.log(error);
    };
 
    setLoading(false);
  }

  const especes = getSpecies(milieu, altitude, saison);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={true}
    >
      <Text style={styles.title}>Radar ornithologique</Text>

      <Text style={styles.sectionTitle}>Mode</Text>
      <View style={styles.row}>
        <Pressable
          style={[styles.button, mode === 'manuel' && styles.activeButton]}
          onPress={() => setMode('manuel')}
        >
          <Text style={styles.buttonText}>Manuel</Text>
        </Pressable>

        <Pressable
          style={[styles.button, mode === 'gps' && styles.activeButton]}
          onPress={() => setMode('gps')}
        >
          <Text style={styles.buttonText}>GPS</Text>
        </Pressable>
      </View>

      {mode === 'gps' && (
        <>
          <Pressable style={styles.scanButton} onPress={scanLocation}>
            <Text style={styles.buttonText}>Scanner ici</Text>
          </Pressable>

          {loading && <Text style={styles.info}>Analyse du milieu…</Text>}

          {coords && (
            <Text style={styles.info}>
              {coords.latitude.toFixed(4)} / {coords.longitude.toFixed(4)}
            </Text>
          )}
        </>
      )}

            <Text style={styles.sectionTitle}>Milieu</Text>
      <View style={styles.row}>
        <Pressable
          style={[styles.button, milieu === 'urbain' && styles.activeButton]}
          onPress={() => setMilieu('urbain')}
        >
          <Text style={styles.buttonText}>Urbain</Text>
        </Pressable>

        <Pressable
          style={[styles.button, milieu === 'urbain_vegetalise' && styles.activeButton]}
          onPress={() => setMilieu('urbain_vegetalise')}
        >
          <Text style={styles.buttonText}>Urbain végétalisé</Text>
        </Pressable>
      </View>

      <View style={styles.row}>
        <Pressable
          style={[styles.button, milieu === 'foret' && styles.activeButton]}
          onPress={() => setMilieu('foret')}
        >
          <Text style={styles.buttonText}>Forêt</Text>
        </Pressable>

        <Pressable
          style={[styles.button, milieu === 'prairie' && styles.activeButton]}
          onPress={() => setMilieu('prairie')}
        >
          <Text style={styles.buttonText}>Prairie</Text>
        </Pressable>
      </View>

      <View style={styles.row}>
        <Pressable
          style={[styles.button, milieu === 'prairie_arboree' && styles.activeButton]}
          onPress={() => setMilieu('prairie_arboree')}
        >
          <Text style={styles.buttonText}>Prairie arborée</Text>
        </Pressable>

        <Pressable
          style={[styles.button, milieu === 'zone_humide' && styles.activeButton]}
          onPress={() => setMilieu('zone_humide')}
        >
          <Text style={styles.buttonText}>Zone humide</Text>
        </Pressable>
      </View>

      <View style={styles.row}>
        <Pressable
          style={[styles.button, milieu === 'plan_eau' && styles.activeButton]}
          onPress={() => setMilieu('plan_eau')}
        >
          <Text style={styles.buttonText}>Plan d’eau</Text>
        </Pressable>

        <Pressable
          style={[styles.button, milieu === 'cultures' && styles.activeButton]}
          onPress={() => setMilieu('cultures')}
        >
          <Text style={styles.buttonText}>Cultures</Text>
        </Pressable>
      </View>

      <View style={styles.row}>
        <Pressable
          style={[styles.button, milieu === 'fourres' && styles.activeButton]}
          onPress={() => setMilieu('fourres')}
        >
          <Text style={styles.buttonText}>Fourrés</Text>
        </Pressable>

        <Pressable
          style={[styles.button, milieu === 'mosaique' && styles.activeButton]}
          onPress={() => setMilieu('mosaique')}
        >
          <Text style={styles.buttonText}>Mosaïque</Text>
        </Pressable>
      </View>

      <Text style={styles.sectionTitle}>Altitude</Text>
      <View style={styles.row}>
        <Pressable
          style={[styles.button, altitude === 'basse' && styles.activeButton]}
          onPress={() => setAltitude('basse')}
        >
          <Text style={styles.buttonText}>Basse</Text>
        </Pressable>

        <Pressable
          style={[styles.button, altitude === 'moyenne' && styles.activeButton]}
          onPress={() => setAltitude('moyenne')}
        >
          <Text style={styles.buttonText}>Moyenne</Text>
        </Pressable>

        <Pressable
          style={[styles.button, altitude === 'haute' && styles.activeButton]}
          onPress={() => setAltitude('haute')}
        >
          <Text style={styles.buttonText}>Haute</Text>
        </Pressable>
      </View>

      <Text style={styles.sectionTitle}>Saison</Text>
      <View style={styles.row}>
        <Pressable
          style={[styles.button, saison === 'printemps' && styles.activeButton]}
          onPress={() => setSaison('printemps')}
        >
          <Text style={styles.buttonText}>Printemps</Text>
        </Pressable>

        <Pressable
          style={[styles.button, saison === 'ete' && styles.activeButton]}
          onPress={() => setSaison('ete')}
        >
          <Text style={styles.buttonText}>Été</Text>
        </Pressable>
      </View>

      <View style={styles.row}>
        <Pressable
          style={[styles.button, saison === 'automne' && styles.activeButton]}
          onPress={() => setSaison('automne')}
        >
          <Text style={styles.buttonText}>Automne</Text>
        </Pressable>

        <Pressable
          style={[styles.button, saison === 'hiver' && styles.activeButton]}
          onPress={() => setSaison('hiver')}
        >
          <Text style={styles.buttonText}>Hiver</Text>
        </Pressable>
      </View>

      <View style={styles.result}>
        <Text style={styles.subtitle}>Configuration actuelle :</Text>
        <Text>Mode : {mode}</Text>
        <Text>Milieu : {milieu}</Text>
        <Text>Altitude : {altitude}</Text>
        <Text>Saison : {saison}</Text>

        <Text style={[styles.subtitle, { marginTop: 16 }]}>Espèces proposées :</Text>

        {especes.length > 0 ? (
          especes.map((oiseau: string, index: number) => (
            <Text key={index}>• {oiseau}</Text>
          ))
        ) : (
          <Text>Aucune espèce renseignée pour cette combinaison.</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#e8f2ee',
  },
  container: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 80,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1f4d3a',
    marginBottom: 20,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    color: '#1f4d3a',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#2f6f55',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  scanButton: {
    backgroundColor: '#1f4d3a',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 8,
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  activeButton: {
    backgroundColor: '#174232',
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  info: {
    marginBottom: 8,
    color: '#444',
  },
  result: {
    marginTop: 24,
    marginBottom: 30,
    padding: 16,
    backgroundColor: '#ffffffaa',
    borderRadius: 10,
  },
  subtitle: {
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1f4d3a',
  },
});