import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native'

export default function TripCard( {trip, onPress} ){

    const parseDate = (dateString) => {
        const[day, month, year] = dateString.split("-");

        return new Date(
            year, month - 1, day
        );
    };

    const getTripStatus = () => {
        const today = new Date();

        const start = parseDate(trip.StartDate);
        const end = parseDate(trip.EndDate);

        if(today < start){
            return "🟢 Upcoming " ;
        }
        if(today >= start && today <= end){
            return "🔵 Ongoing";
        }
        return "⚫ Completed"
    }

    return(
        <View>
            <TouchableOpacity 
                style={styles.card}
                onPress={onPress}
            >
                <Text style={styles.title}>
                    🌴{trip.tripName}         <Text>→</Text>
                </Text>

                <Text style={styles.text}>
                    📍{trip.Destination}
                </Text>

                <Text style={styles.text}>
                    🗓️{trip.StartDate} - {trip.EndDate}
                </Text>

                <Text style={styles.budget}>
                    💰 ₹{trip.Budget}
                </Text>

                <Text style={styles.status}>
                    {getTripStatus()}
                </Text>

            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    card:{
        backgroundColor:'#fff',
        marginHorizontal:20,
        marginVertical:4,
        padding:20,
        borderRadius:15,
        elevation:5,
        shadowColor:'#000',
        shadowOffset:{
            width:0,
            height:2
        },
        shadowOpacity:0.2,
        shadowRadius:5
    },
    title:{
        fontSize:22,
        fontWeight:'bold',
        marginBottom:10
    },
    text:{
        fontSize:16,
        marginBottom:6
    },
    budget:{
        fontSize:18,
        fontWeight:'bold',
        color:'green',
        marginTop:10
    },
    status:{
        alignSelf:'flex-end',
        fontSize:15,
        fontWeight:'bold'
    }
})