import React, { useState, useCallback } from "react";
import { Text, View, StyleSheet, TouchableOpacity, FlatList, TextInput, Alert, ActivityIndicator } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import TripCard from "../Components/TripCard";
import { API_BASE_URL } from "../config/api";

export default function MyTripsScreen({ navigation }) {
  const [trips, setTrips] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const loadTrips = useCallback(async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        navigation.reset({ index: 0, routes: [{ name: "Login" }] });
        return;
      }
      const response = await fetch(`${API_BASE_URL}/api/trips`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.status === 401) {
        await AsyncStorage.removeItem("token");
        Alert.alert("Session expired", "Please log in again.");
        navigation.reset({ index: 0, routes: [{ name: "Login" }] });
        return;
      }
      if (!response.ok) throw new Error(data.message || "Failed to fetch trips");
      if (!Array.isArray(data)) throw new Error("Server response was not a trips list");
      setTrips(data);
    } catch (error) {
      console.log("Load trips error:", error.message);
      Alert.alert("Could not load trips", `${error.message}\nCheck the backend and API IP.`);
    } finally {
      setLoading(false);
    }
  }, [navigation]);

  useFocusEffect(useCallback(() => { loadTrips(); }, [loadTrips]));

  const filteredTrips = trips.filter((trip) =>
    (trip.tripName || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Trips</Text>
      <TextInput
        placeholder="🔍 Search"
        value={search}
        onChangeText={setSearch}
        style={styles.search}
      />
      {loading ? <ActivityIndicator size="large" /> : (
        <FlatList
          data={filteredTrips}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TripCard trip={item} onPress={() => navigation.navigate("Trip Details", { trip: item })} />
          )}
          ListEmptyComponent={<Text style={styles.empty}>No Trips Found</Text>}
          contentContainerStyle={filteredTrips.length === 0 ? { flexGrow: 1 } : undefined}
          onRefresh={loadTrips}
          refreshing={loading}
        />
      )}
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Create Trip")}>
        <Text style={styles.buttonText}>+ Create Trip</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f3f3f3", paddingTop: 10 },
  title: { fontWeight: "bold", fontSize: 30, alignSelf: "center", marginBottom: 10 },
  search: { backgroundColor: "#fff", marginHorizontal: 20, marginVertical: 12, padding: 15, borderRadius: 12, fontSize: 18, elevation: 3 },
  empty: { fontSize: 18, fontWeight: "bold", textAlign: "center", marginTop: 25 },
  button: { backgroundColor: "green", borderRadius: 10, padding: 15, alignSelf: "center", marginVertical: 20 },
  buttonText: { fontWeight: "bold", fontSize: 18, color: "#fff" },
});
