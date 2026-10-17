import React, { useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity, TextInput, Alert, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "../config/api";

function parseDDMMYYYY(value) {
  const match = /^(\d{2})-(\d{2})-(\d{4})$/.exec(value.trim());
  if (!match) return null;
  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return null;
  return date;
}

export default function CreateTripScreen({ navigation }) {
  const [tripName, setTripName] = useState("");
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [budget, setBudget] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!tripName.trim() || !destination.trim() || !startDate.trim() || !endDate.trim() || !budget.trim()) {
      Alert.alert("Missing details", "Please fill in all fields.");
      return;
    }
    const start = parseDDMMYYYY(startDate);
    const end = parseDDMMYYYY(endDate);
    if (!start || !end) {
      Alert.alert("Invalid date", "Enter dates in DD-MM-YYYY format, for example 26-10-2026.");
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

      const response = await fetch(`${API_BASE_URL}/api/trips`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
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
        Alert.alert("Trip error", data.message || `Request failed (${response.status}).`);
        return;
      }
      Alert.alert("Success", "Trip created successfully.");
      navigation.navigate("My Trips", { refresh: Date.now() });
    } catch (error) {
      console.log("Create trip error:", error.message);
      Alert.alert("Connection error", `Unable to reach ${API_BASE_URL}.`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>Create Trip</Text>
      <TextInput style={styles.input} placeholder="Trip Name" value={tripName} onChangeText={setTripName} />
      <TextInput style={styles.input} placeholder="Destination" value={destination} onChangeText={setDestination} />
      <TextInput style={styles.input} placeholder="Start Date (DD-MM-YYYY)" value={startDate} onChangeText={setStartDate} keyboardType="numbers-and-punctuation" />
      <TextInput style={styles.input} placeholder="End Date (DD-MM-YYYY)" value={endDate} onChangeText={setEndDate} keyboardType="numbers-and-punctuation" />
      <TextInput style={styles.input} placeholder="Budget (₹)" value={budget} onChangeText={setBudget} keyboardType="numeric" />
      <TouchableOpacity style={styles.button} onPress={handleSave} disabled={saving}>
        <Text style={styles.buttonText}>{saving ? "Saving..." : "Save"}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: "#f3f3f3" },
  title: { fontSize: 28, fontWeight: "bold", textAlign: "center", marginBottom: 30 },
  input: { backgroundColor: "#ffc0cb", borderRadius: 10, padding: 14, fontSize: 17, marginBottom: 14 },
  button: { backgroundColor: "green", borderRadius: 10, padding: 15, alignItems: "center", alignSelf: "center", minWidth: 130, marginTop: 12 },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});
