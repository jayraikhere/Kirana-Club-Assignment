import React, { useState, useEffect, useCallback } from 'react';
import { FlatList, TouchableOpacity, TextInput, StyleSheet, Dimensions, Button } from 'react-native';
import axios from 'axios';
import LottieView from 'lottie-react-native';

const SearchGifs = () => {
  const [searchText, setSearchText] = useState('');
  const [searchGiphyData, setSearchGiphyData] = useState([]);
  const [searchOffset, setSearchOffset] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  const screenWidth = Dimensions.get('window').width;

  const API_KEY = 'pc0ikHB0p2EyUNHR7Veq1Na3Roly0MNv'; // Replace with your Giphy API key

  const searchGiphy = async (offset = 0) => {
    try {
      const response = await axios.get(
        `https://api.giphy.com/v1/gifs/search?q=${searchText}&api_key=${API_KEY}&limit=10&offset=${offset}`
      );
      const newGiphyData = response.data.data;
      if (offset === 0) {
        setSearchGiphyData(newGiphyData);
      } else {
        setSearchGiphyData([...searchGiphyData, ...newGiphyData]);
      }
      setSearchOffset(offset);
    } catch (error) {
      console.error('Error fetching Giphy data: ', error);
    }
  };

  const loadMoreSearchGiphy = useCallback(() => {
    if (hasMoreData && !loadingMore) {
      setLoadingMore(true);
      searchGiphy(searchOffset + 10).then(() => {
        setLoadingMore(false);
      });
    }
  }, [searchOffset, hasMoreData, loadingMore]);

  return (
    <React.Fragment>
      <TextInput
        style={styles.searchBox}
        placeholder="Search Giphy"
        onChangeText={(text) => setSearchText(text)}
        value={searchText}
        onSubmitEditing={() => {
          setSearchOffset(0); // Reset offset when submitting a new search
          searchGiphy(0);
        }}
      />
      <FlatList
        data={searchGiphyData}
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
        onEndReached={loadMoreSearchGiphy}
        onEndReachedThreshold={0.1}
      />
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  searchBox: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 8,
    marginTop: 16,
  },
  giphyTile: {
    flex: 1,
    aspectRatio: 1,
    margin: 4,
  },
});

export default SearchGifs;
