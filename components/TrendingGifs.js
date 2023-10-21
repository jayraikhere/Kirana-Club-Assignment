import React, { useState, useEffect } from 'react';
import {
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import axios from 'axios';
import LottieView from 'lottie-react-native';

const TrendingGifs = () => {
  const [trendingGiphyData, setTrendingGiphyData] = useState([]);
  const screenWidth = Dimensions.get('window').width;

  const API_KEY = 'pc0ikHB0p2EyUNHR7Veq1Na3Roly0MNv'; // Replace with your Giphy API key

  const loadTrendingGiphy = async () => {
    try {
      const response = await axios.get(
        `https://api.giphy.com/v1/gifs/trending?api_key=${API_KEY}&limit=10`
      );
      setTrendingGiphyData(response.data.data);
    } catch (error) {
      console.error('Error fetching Giphy data: ', error);
    }
  };

  useEffect(() => {
    loadTrendingGiphy();
  }, []);

  return (
    <FlatList
      data={trendingGiphyData}
      numColumns={2}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity style={styles.giphyTile}>
          <LottieView
            source={{ uri: item.images.fixed_height.url }}
            autoPlay
            loop
            style={{ width: screenWidth / 2, height: screenWidth / 2 }}
          />
        </TouchableOpacity>
      )}
    />
  );
};

const styles = StyleSheet.create({
  giphyTile: {
    flex: 1,
    aspectRatio: 1,
    margin: 4,
  },
});

export default TrendingGifs;
