import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Vibration, Button } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style = {styles.text}>My Name Is JunYoungCho!!</Text>
      <Button title="Vib Once" onPress = {() => Vibration.vibrate()} />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text : {
    fontSize: 30,
    color: "blue",
  }
});