import React, { useEffect } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";

export default function MapScreen() {
    const start = Date.now();

    const total = 5000;

    const data = Array.from({ length: total }, (_, i) => ({
        id: i + 1,
        name: "User " + (i + 1),
    }));

    useEffect(() => {
        const end = Date.now();
        console.log("Waktu render:", end - start, "ms");
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Daftar User</Text>
            <Text style={styles.subtitle}>Total: {total}</Text>

            <ScrollView>
                {data.map((item) => (
                    <View key={item.id} style={styles.card}>
                        <Text style={styles.id}>{item.id}</Text>
                        <Text style={styles.name}>{item.name}</Text>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 15 },
    title: { fontSize: 22, fontWeight: "bold" },
    subtitle: { marginBottom: 10, color: "#666" },
    card: {
        flexDirection: "row",
        padding: 12,
        marginBottom: 8,
        borderRadius: 8,
        backgroundColor: "#f2f2f2",
    },
    id: { width: 40, color: "#888" },
    name: { fontWeight: "bold" },
});
