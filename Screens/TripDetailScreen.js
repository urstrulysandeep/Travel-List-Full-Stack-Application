import React, { useState } from "react";
import { Alert, View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../config/api";
import WeatherCard from "../Components/WeatherCard";
import DestinationImage from "../Components/DestinationImage";

export default function TripDetailScreen({ route, navigation }) {
  const { trip } = route.params;
  const [busy, setBusy] = useState(false);

  const handleDelete = async () => {
    Alert.alert("Delete trip", `Delete "${trip.tripName}"?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          setBusy(true);
          try {
            const token = await AsyncStorage.getItem("token");
            if (!token) {
              Alert.alert("Session expired", "Please log in again.");
              navigation.reset({ index: 0, routes: [{ name: "Login" }] });
              return;
            }
            const response = await fetch(`${API_BASE_URL}/api/trips/${trip._id}`, {
              method: "DELETE",
              headers: { Authorization: `Bearer ${token}` },
            });
            const data = await response.json();
            if (!response.ok) {
              Alert.alert("Delete failed", data.message || "Could not delete trip.");
              return;
            }
            navigation.navigate("My Trips", { refresh: Date.now() });
          } catch (error) {
            console.log("Delete trip error:", error.message);
            Alert.alert("Connection error", "Could not reach the backend.");
          } finally {
            setBusy(false);
          }
        },
      },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{trip.tripName}</Text>
      <Text style={styles.info}>📍 Destination: {trip.Destination}</Text>
      <Text style={styles.info}>🗓️ Start Date: {trip.StartDate}</Text>
      <Text style={styles.info}>🗓️ End Date: {trip.EndDate}</Text>
      <Text style={styles.info}>💰 Budget: ₹{trip.Budget}</Text>
      <View style={styles.buttons}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Edit Trip", { trip })}>
          <Text style={styles.buttonText}>Edit Trip</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.delete]} onPress={handleDelete} disabled={busy}>
          <Text style={styles.buttonText}>{busy ? "Deleting..." : "Delete Trip"}</Text>
        </TouchableOpacity>
      </View>
      <WeatherCard destination={trip.Destination} />
      <DestinationImage destination={trip.Destination} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20 },
  title: { fontSize: 28, fontWeight: "bold", textAlign: "center", marginBottom: 25 },
  info: { fontSize: 17, paddingVertical: 10 },
  buttons: { flexDirection: "row", justifyContent: "space-around", marginTop: 30 },
  button: { borderRadius: 8, paddingVertical: 14, paddingHorizontal: 18, backgroundColor: "green" },
  delete: { backgroundColor: "#b00020" },
  buttonText: { fontSize: 15, color: "white", fontWeight: "bold" },
  note: { color: "#666", marginTop: 30, lineHeight: 20 },
});
