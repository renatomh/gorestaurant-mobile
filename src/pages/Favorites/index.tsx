import React, { useEffect, useState } from 'react';
import { Image } from 'react-native';

import { useNavigation } from '@react-navigation/native';

import api from '../../services/api';
import formatValue from '../../utils/formatValue';

import {
  Container,
  Header,
  HeaderTitle,
  FoodsContainer,
  FoodList,
  Food,
  FoodImageContainer,
  FoodContent,
  FoodTitle,
  FoodDescription,
  FoodPricing,
} from './styles';

interface Food {
  id: number;
  name: string;
  description: string;
  price: number;
  thumbnail_url: string;
  formattedPrice: string;
}

const Favorites: React.FC = () => {
  const [favorites, setFavorites] = useState<Food[]>([]);

  const navigation = useNavigation();

  // Função para lidar com a seleção de um prato, indo para a página com detalhes do mesmo
  async function handleNavigate(id: number): Promise<void> {
    // Navegando para a página de detalhes dos pratos passando o id do prato selecionado
    navigation.navigate('FoodDetails', {
      id,
    });
  }

  useEffect(() => {
    async function loadFavorites(): Promise<void> {
      // Carregando os pratos favoritos da API
      const response = await api.get('/favorites');
      // Definindo os pratos favoritos incluindo ainda o preço formatado
      setFavorites(
        response.data.map((favorite: Food) => ({
          ...favorite,
          formattedPrice: formatValue(favorite.price)
        }))
      );
    }
    // Chamando a função criada
    loadFavorites();
  }, []);

  return (
    <Container>
      <Header>
        <HeaderTitle>Meus favoritos</HeaderTitle>
      </Header>

      <FoodsContainer>
        <FoodList
          data={favorites}
          keyExtractor={item => String(item.id)}
          renderItem={({ item }) => (
            <Food
              onPress={() => handleNavigate(item.id)}
              activeOpacity={0.6}
            >
              <FoodImageContainer>
                <Image
                  style={{ width: 88, height: 88 }}
                  source={{ uri: item.thumbnail_url }}
                />
              </FoodImageContainer>
              <FoodContent>
                <FoodTitle>{item.name}</FoodTitle>
                <FoodDescription>{item.description}</FoodDescription>
                <FoodPricing>{item.formattedPrice}</FoodPricing>
              </FoodContent>
            </Food>
          )}
        />
      </FoodsContainer>
    </Container>
  );
};

export default Favorites;
