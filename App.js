import * as Location from 'expo-location';
import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ScrollView, Dimensions, ActivityIndicator} from 'react-native';

import { Fontisto } from '@expo/vector-icons';

const { width:SCREEN_WIDTH } = Dimensions.get("window");
//get Demensions API from ReactNative to get users phone width, define with name 'SCREEN_WIDTH'

const API_KEY = "83e4e300e0fb764221e49230cbcd6b22";
//key for weather api -> in this case if you build this app, you must get this keycode from server

const icons = {
  "Clouds": "cloudy",
  "Clear": "day-sunny",
  "Snow": "snowflake",
  "Rain": "rains",
  "Atmosphere": "cludy-gusts",
  "Drizzle": "rain",
  "Thunderstorm": "lightning",
}
const backColor = {
  "Clouds": "darkgrey",
  "Clear": "orange",
  "Snow": "cyan",
  "Rain": "blue",
  "Atmosphere": "cyan",
  "Drizzle": "cyan",
  "Thunderstorm": "yellow",
}

export default function App() {
  const [city, setCity] = useState("Loading...");
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true); 
  const getWeather = async () => {
    const {granted} = await Location.requestForegroundPermissionsAsync();
    if(!granted){
      setOk(false);
    }else{
      const {coords:{latitude, longitude}} = await Location.getCurrentPositionAsync({accuracy:5});
      const location = await Location.reverseGeocodeAsync({latitude, longitude}, {useGoogleMaps: false});
      setCity(location[0].city);
      const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`);
      const json = await response.json();
      setDays(json.daily);
    }
  }
  //get weather information from api -> 1. ask user to get location 2. get latitude, longitude from Location 3. get city name from location 4. fetch api and get weather infos
  useEffect(() => {
    getWeather();
  },[]);
  
  return (
    <View style={styles.container}>
      <StatusBar style="light" /> 
      {ok ? (
        <View style={styles.city}>
          <Text style={styles.cityName}>{city}</Text>
        </View>
      ) : (
        <View style={styles.city}>
          <Text style={styles.cityName}>Give Us A Permission!!</Text>
        </View>
      )}
      <ScrollView pagingEnabled horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.weather}>
        {days.length === 0 ? (
        <View style={styles.day}>
          <ActivityIndicator color="white" size="large" />
        </View> 
        ) : (
        days.map((day,index) => <View key={index} style={styles.day}>
          <View>
            <Fontisto name={icons[day.weather[0].main]} size={80} color={backColor[day.weather[0].main]} />
            <Text style={styles.temp}>{parseFloat(day.temp.day).toFixed(0)}°</Text>
          </View>
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
    backgroundColor:"black",
  },
  city: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cityName: {
    color: "white",
    fontSize: 70,
    fontWeight: "500",
  },
  weather: {
  },
  day: {
    width: SCREEN_WIDTH,
    alignItems: "center",
  },
  temp:{
    color: "white",
    fontSize: 200,
  },
  description: {
    color: "white",
    marginTop: -30,
    fontSize: 60,
  },
  tinyText: {
    fontSize: 20,
    color: "white",
  },
}) 
  

