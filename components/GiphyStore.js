import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, Image, TouchableOpacity, StyleSheet, Button, Share } from 'react-native';
import axios from 'axios';

const GiphyStore = () => {
  const [searchText, setSearchText] = useState('');
  const [searchGiphyData, setSearchGiphyData] = useState([]);
  const [searchOffset, setSearchOffset] = useState(0);
  const [trendingGiphyData, setTrendingGiphyData] = useState([]);
  const [activeSection, setActiveSection] = useState('Trending');

  const API_KEY = 'pc0ikHB0p2EyUNHR7Veq1Na3Roly0MNv'; // Replace with your Giphy API key

  const searchGiphy = async (offset = 0) => {
    try {
      const response = await axios.get(
        `https://api.giphy.com/v1/gifs/search?q=${searchText}&api_key=${API_KEY}&limit=10&offset=${offset}`
      );
      const newGiphyData = response.data.data;
      setSearchOffset(offset);
      setSearchGiphyData(offset === 0 ? newGiphyData : [...searchGiphyData, ...newGiphyData]);
    } catch (error) {
      console.error('Error fetching Giphy data: ', error);
    }
  };

  const loadMoreSearchGiphy = () => {
    searchGiphy(searchOffset + 10);
  };

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

  const toggleSection = (section) => {
    setActiveSection(section);
  };

  const shareGif = (gifUrl) => {
    Share.share(
      {
        message: 'Check out this cool GIF!',
        url: gifUrl,
      },
      {
        dialogTitle: 'Share this GIF',
      }
    )
      .then((result) => {
        if (result.action === Share.sharedAction) {
          console.log('GIF shared successfully');
        } else if (result.action === Share.dismissedAction) {
          console.log('Sharing was dismissed');
        }
      })
      .catch((error) => {
        console.error('Error sharing GIF: ', error);
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button
          title="Trending"
          onPress={() => toggleSection('Trending')}
          color={activeSection === 'Trending' ? 'blue' : 'gray'}
        />
        <Button
          title="Search"
          onPress={() => toggleSection('Search')}
          color={activeSection === 'Search' ? 'blue' : 'gray'}
        />
      </View>
      {activeSection === 'Trending' && (
        <FlatList
          data={trendingGiphyData}
          numColumns={2}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.giphyTile}>
              <Image
                source={{ uri: item.images.fixed_height.url }}
                style={styles.image}
              />
              <TouchableOpacity
                style={styles.shareButton}
                onPress={() => shareGif(item.images.fixed_height.url)}
              >
                <Text style={styles.shareButtonText}>Share</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        />
      )}
      {activeSection === 'Search' && (
        <><TextInput
          style={styles.searchBox}
          placeholder="Search Giphy"
          onChangeText={(text) => setSearchText(text)}
          value={searchText}
          onSubmitEditing={searchGiphy}
        />
          <FlatList
            data={searchGiphyData}
            numColumns={2}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.giphyTile}>
                <Image
                  source={{ uri: item.images.fixed_height.url }}
                  style={styles.image}
                />
                <TouchableOpacity
                  style={styles.shareButton}
                  onPress={() => shareGif(item.images.fixed_height.url)}
                >
                  <Text style={styles.shareButtonText}>Share</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            )}
            onEndReached={loadMoreSearchGiphy}
            onEndReachedThreshold={0.1}
          />
        </>
      )}
      {/* <TextInput
        style={styles.searchBox}
        placeholder="Search Giphy"
        onChangeText={(text) => setSearchText(text)}
        value={searchText}
        onSubmitEditing={searchGiphy}
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  searchBox: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 8,
    marginBottom: 16,
  },
  giphyTile: {
    flex: 1,
    aspectRatio: 1,
    margin: 4,
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
  },
  shareButton: {
    backgroundColor: 'blue',
    padding: 8,
    borderRadius: 5,
    marginTop: 8,
    alignItems: 'center',
  },
  shareButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default GiphyStore;
