import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image, FlatList, ActivityIndicator } from 'react-native';
import { CacheManager } from 'react-native-expo-image-cache';

const API_KEY = 'd597a139e2810c48a0892f8798e7d916';
const BASE_URL = 'https://api.themoviedb.org/3';
const POSTER_BASE_URL = 'https://api.themoviedb.org/3/movie/550';

interface Movie {
  id: number;
  backdropPath: string;
  posterPath: string;
  title: string;
  originalTitle: string;
  popularity: number;
  voteAverage: number;
  voteCount: number;
  releaseDate: string;
  overview: string;
}

const RenderPoster: React.FC<{ uri: string }> = ({ uri }) => {
  const [cachedPath, setCachedPath] = useState<string | null>(null);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const path = await CacheManager.get(uri, {}).getPath();
        setCachedPath(path || null);
      } catch (error) {
        console.error('Error fetching image:', error);
      }
    };

    fetchImage();
  }, [uri]);

  if (!cachedPath) {
    return <ActivityIndicator />;
  }

  return (
    <Image style={styles.poster} source={{ uri: cachedPath }} resizeMode="cover" />
  );
};

const renderItem: React.FC<{ item: Movie }> = ({ item }) => {
  const posterUrl = item.posterPath ? POSTER_BASE_URL + item.posterPath : '';


  return (
    <View style={styles.movieItem}>
      <View style={styles.posterContainer}>
        <RenderPoster uri={posterUrl} />
      </View>
      <View style={styles.movieInfo}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.originalTitle}>Título Original: {item.originalTitle}</Text>
        <Text style={styles.releaseDate}>Ano de Lançamento: {item.releaseDate}</Text>
        <Text style={styles.voteInfo}>Média de Votos: {item.voteAverage} ({item.voteCount} votos)</Text>
        <Text style={styles.popularity}>Popularidade: {item.popularity}</Text>
        <Text style={styles.overview}>{item.overview}</Text>
      </View>
    </View>
  );
};

const App: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await fetch(
        `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=pt-BR&page=1`
      );
      const data = await response.json();
      setMovies(data.results);
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.pageTitle}>SENAIFLIX</Text>
      <FlatList
        data={movies}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#222',
    padding: 10,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
  },
  movieItem: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  posterContainer: {
    width: 120,
    height: 180,
    borderRadius: 5,
    overflow: 'hidden',
  },
  poster: {
    width: '100%',
    height: '100%',
  },
  movieInfo: {
    flex: 1,
    marginLeft: 10,
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  originalTitle: {
    fontSize: 16,
    color: 'white',
    marginBottom: 5,
  },
  releaseDate: {
    fontSize: 14,
    color: 'white',
    marginBottom: 5,
  },
  voteInfo: {
    fontSize: 14,
    color: 'white',
    marginBottom: 5,
  },
  popularity: {
    fontSize: 14,
    color: 'white',
    marginBottom: 5,
  },
  overview: {
    fontSize: 14,
    color: 'white',
  },
});

export default App;