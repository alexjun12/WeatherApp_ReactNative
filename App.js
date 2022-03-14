import * as Location from 'expo-location';
import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ScrollView, Dimensions, ActivityIndicator} from 'react-native';

const { width:SCREEN_WIDTH } = Dimensions.get("window");

const API_KEY = "83e4e300e0fb764221e49230cbcd6b22";

export default function App() {
  const [city, setCity] = useState("Loading...");
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true); 
  const getWeather = async () => {
    const {granted} = await Location.requestForegroundPermissionsAsync();
    if(!granted){
      setOk(false);
    }
    const {coords:{latitude, longitude}} = await Location.getCurrentPositionAsync({accuracy:5});
    const location = await Location.reverseGeocodeAsync({latitude, longitude}, {useGoogleMaps: false});
    setCity(location[0].city);
    const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`);
    const json = await response.json();
    setDays(json.daily);
  }
  useEffect(() => {
    getWeather();
  },[]);
  return (
    <View style={styles.container}>
      <StatusBar style="light" /> 
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView pagingEnabled horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.weather}>
        {days.length === 0 ? (
        <View style={styles.day}>
          <ActivityIndicator color="white" size="large" />
        </View> 
        ) : (
        days.map((day,index) => <View key={index} style={styles.day}>
          <Text style={styles.temp}>{parseFloat(day.temp.day).toFixed(0)}°</Text>
          <Text style={styles.description}>{day.weather[0].main}</Text>
          <Text style={styles.tinyText}>{day.weather[0].description}</Text>
        </View>)
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor:"#6937a1"
  },
  city: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cityName: {
    color: "yellow",
    fontSize: 70,
    fontWeight: "500",
    fontFamily: "tway_sky",
  },
  weather: {
  },
  day: {
    width: SCREEN_WIDTH,
    //alignItems: "center",
  },
  temp:{
    color: "yellow",
    fontSize: 200,
  },
  description: {
    color: "yellow",
    marginTop: -30,
    fontSize: 60,
  },
  tinyText: {
    fontSize: 20,
    color: "yellow",
  },
}) 
  

