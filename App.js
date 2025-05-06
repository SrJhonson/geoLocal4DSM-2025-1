import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import * as Location from 'expo-location';

export default function App() {
  const [nome, setNome] = useState('');
  const [rua, setRua] = useState('');
  const [numero, setNumero] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [usuarios, setUsuarios] = useState([]);
  const [region, setRegion] = useState({
    latitude: -23.55052,
    longitude: -46.633308,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const cadastrarUsuario = async () => {
    if (!nome || !rua || !numero || !cidade || !estado) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    const enderecoCompleto = `${rua}, ${numero}, ${cidade}, ${estado}`;

    try {
      const resultado = await Location.geocodeAsync(enderecoCompleto);
      if (resultado.length === 0) {
        Alert.alert('Erro', 'Endereço não encontrado.');
        return;
      }

      const { latitude, longitude } = resultado[0];

      const novoUsuario = {
        id: Date.now(),
        nome,
        endereco: enderecoCompleto,
        coordenadas: { latitude, longitude },
      };

      setUsuarios([...usuarios, novoUsuario]);
      setRegion({
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });

      // Limpar campos
      setNome('');
      setRua('');
      setNumero('');
      setCidade('');
      setEstado('');
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao geocodificar o endereço.');
      console.error(error);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Nome completo"
            value={nome}
            onChangeText={setNome}
          />
          <TextInput
            style={styles.input}
            placeholder="Rua"
            value={rua}
            onChangeText={setRua}
          />
          <TextInput
            style={styles.input}
            placeholder="Número"
            value={numero}
            onChangeText={setNumero}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Cidade"
            value={cidade}
            onChangeText={setCidade}
          />
          <TextInput
            style={styles.input}
            placeholder="Estado"
            value={estado}
            onChangeText={setEstado}
          />
          <Button title="Cadastrar Usuário" onPress={cadastrarUsuario} />
        </View>
        <MapView style={styles.map} region={region}>
          {usuarios.map((usuario) => (
            <Marker
              key={usuario.id}
              coordinate={usuario.coordenadas}
            >
              <Callout>
                <View style={{ width: 200 }}>
                  <Text style={{ fontWeight: 'bold' }}>{usuario.nome}</Text>
                  <Text>{usuario.endereco}</Text>
                  <Text>Latitude: {usuario.coordenadas.latitude.toFixed(6)}</Text>
                  <Text>Longitude: {usuario.coordenadas.longitude.toFixed(6)}</Text>
                </View>
              </Callout>
            </Marker>
          ))}
        </MapView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  form: {
    padding: 20,
    backgroundColor: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  map: {
    flex: 1,
    height: 400,
  },
});
