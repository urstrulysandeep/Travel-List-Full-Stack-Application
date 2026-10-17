import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  Text,
  ActivityIndicator,
  StyleSheet,
} from "react-native";

import {API_BASE_URL} from "../config/api";

export default function DestinationImage({ destination }) {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadImage() {
      setLoading(true);
      setImageUrl(null);

      try {
        const response = await fetch(
          `${API_BASE_URL}/api/destinations/image?destination=${encodeURIComponent(destination)}`
        );

        if (!response.ok) {
          throw new Error("Image unavailable");
        }

        const data = await response.json();

        if (!cancelled) {
          setImageUrl(data.imageUrl);
        }
      } catch (error) {
        if (!cancelled) {
          setImageUrl(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    if (destination?.trim()) {
      loadImage();
    } else {
      setLoading(false);
    }

    return () => {
      cancelled = true;
    };
  }, [destination]);

  if (loading) {
    return (
      <View style={styles.placeholder}>
        <ActivityIndicator />
        <Text>Loading destination image...</Text>
      </View>
    );
  }

  if (!imageUrl) {
    return (
      <View style={styles.placeholder}>
        <Text>Destination image unavailable</Text>
      </View>
    );
  }

  return (
    <Image
      source={{ uri: imageUrl }}
      style={styles.image}
      resizeMode="cover"
      onError={() => setImageUrl(null)}
      accessibilityLabel={`Travel destination: ${destination}`}
    />
  );
}

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: 220,
    borderRadius: 16,
    marginVertical: 12,
  },
  placeholder: {
    height: 180,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EAF4FF",
    borderRadius: 16,
    marginVertical: 12,
    gap: 8,
  },
});