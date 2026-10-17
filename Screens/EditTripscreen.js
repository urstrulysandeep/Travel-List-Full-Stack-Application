import React, { useState } from "react";
import { Alert, Text, View, TextInput, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../config/api";

function parseDate(value) {
  const match = /^(\d{2})-(\d{2})-(\d{4})$/.exec(value.trim());
  if (!match) return null;
  const day = Number(match[1]), month = Number(match[2]), year = Number(match[3]);
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day ? date : null;
}

export default function EditTripScreen({ route, navigation }) {
  const { trip } = route.params;
  const [tripName, setTripName] = useState(trip.tripName || "");
  const [destination, setDestination] = useState(trip.Destination || "");
  const [startDate, setStartDate] = useState(trip.StartDate || "");
  const [endDate, setEndDate] = useState(trip.EndDate || "");
  const [budget, setBudget] = useState(String(trip.Budget ?? ""));
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    const start = parseDate(startDate);
    const end = parseDate(endDate);
    if (!tripName.trim() || !destination.trim() || !start || !end || budget.trim() === "") {
      Alert.alert("Invalid details", "Fill every field and use DD-MM-YYYY for both dates.");
      return;
    }
    if (end < start) {
      Alert.alert("Invalid dates", "End date cannot be before start date.");
      return;
    }
    const numericBudget = Number(budget);
    if (!Number.isFinite(numericBudget) || numericBudget < 0) {
      Alert.alert("Invalid budget", "Enter a valid non-negative budget.");
      return;
    }

    setSaving(true);
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Session expired", "Please log in again.");
        navigation.reset({ index: 0, routes: [{ name: "Login" }] });
        return;
      }
      const response = await fetch(`${API_BASE_URL}/api/trips/${trip._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          tripName: tripName.trim(),
          Destination: destination.trim(),
          StartDate: startDate.trim(),
          EndDate: endDate.trim(),
          Budget: numericBudget,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        Alert.alert("Update failed", data.message || "Could not update trip.");
        return;
      }
      Alert.alert("Success", "Trip updated.");
      navigation.navigate("My Trips", { refresh: Date.now() });
    } catch (error) {
      console.log("Update trip error:", error.message);
      Alert.alert("Connection error", "Could not reach the backend.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Edit Trip</Text>
      <TextInput style={styles.input} value={tripName} onChangeText={setTripName} placeholder="Trip Name" />
      <TextInput style={styles.input} value={destination} onChangeText={setDestination} placeholder="Destination" />
      <TextInput style={styles.input} value={startDate} onChangeText={setStartDate} placeholder="Start Date (DD-MM-YYYY)" />
      <TextInput style={styles.input} value={endDate} onChangeText={setEndDate} placeholder="End Date (DD-MM-YYYY)" />
      <TextInput style={styles.input} value={budget} onChangeText={setBudget} keyboardType="numeric" placeholder="Budget" />
      <TouchableOpacity style={styles.button} onPress={handleSave} disabled={saving}>
        <Text style={styles.buttonText}>{saving ? "Saving..." : "Save"}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20 },
  title: { fontSize: 26, fontWeight: "bold", textAlign: "center", marginBottom: 25 },
  input: { fontSize: 16, padding: 13, marginVertical: 8, backgroundColor: "#f3f3f3", borderRadius: 8 },
  button: { alignItems: "center", padding: 14, borderRadius: 10, backgroundColor: "green", marginTop: 20, alignSelf: "center", minWidth: 130 },
  buttonText: { fontSize: 17, color: "#fff", fontWeight: "bold" },
});
