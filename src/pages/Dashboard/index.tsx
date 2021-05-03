import React, { useEffect, useState } from 'react';
import { Image, ScrollView } from 'react-native';

import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import Logo from '../../assets/logo-header.png';
import SearchInput from '../../components/SearchInput';

import api from '../../services/api';
import formatValue from '../../utils/formatValue';

import {
  Container,
  Header,
  FilterContainer,
  Title,
  CategoryContainer,
  CategorySlider,
  CategoryItem,
  CategoryItemTitle,
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

interface Category {
  id: number;
  title: string;
  image_url: string;
}

const Dashboard: React.FC = () => {
  // Estados para os pratos, categorias e categoria selecionada
  const [foods, setFoods] = useState<Food[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<
    number | undefined
  >();
  // Estado para o campo de busca por pratos
  const [searchValue, setSearchValue] = useState('');

  const navigation = useNavigation();

  // Função para lidar com a seleção de um prato, indo para a página com detalhes do mesmo
  async function handleNavigate(id: number): Promise<void> {
    // Navegando para a página de detalhes dos pratos passando o id do prato selecionado
    navigation.navigate('FoodDetails', {
      id,
    });
  }

  // Função para buscar os pratos em função de mudanças na categoria selecionada ou no campo de busca
  useEffect(() => {
    async function loadFoods(): Promise<void> {
      // Carregando os pratos da API
      const response = await api.get('/foods', {
        // Definindo os parâmetros para a busca
        params: {
          category_like: selectedCategory,
          name_like: searchValue,
        },
      });
      // Definindo os pratos incluindo ainda o preço formatado
      setFoods(
        response.data.map((food: Food) => ({
          ...food,
          formattedPrice: formatValue(food.price)
        }))
      );
    }
    // Chamando a função criada
    loadFoods();
  }, [selectedCategory, searchValue]);

  // Função para buscar e configurar as categorias da API
  useEffect(() => {
    async function loadCategories(): Promise<void> {
      // Carregando as categorias da API
      const response = await api.get('/categories');
      // Definindo as categorias obtidas
      setCategories(response.data);
    }
    // Chamando a função criada
    loadCategories();
  }, []);

  // Função para definir a categoria selecionada para a busca na API
  function handleSelectCategory(id: number): void {
    // Caso selecione a categoria já selecionada
    if (selectedCategory == id) {
      // Retiramos a seleção da mesma
      setSelectedCategory(undefined);
    }
    // Caso não seja, selecionamos a categoria
    else {
      setSelectedCategory(id);
    }
  };

  return (
    <Container>
      <Header>
        <Image source={Logo} />
        <Icon
          name="log-out"
          size={24}
          color="#FFB84D"
          onPress={() => navigation.navigate('Home')}
        />
      </Header>
      <FilterContainer>
        {/* Campo para busca dos pratos */}
        <SearchInput
          value={searchValue}
          onChangeText={setSearchValue}
          placeholder="Qual comida você procura?"
        />
      </FilterContainer>
      <ScrollView>
        <CategoryContainer>
          <Title>Categorias</Title>
          <CategorySlider
            contentContainerStyle={{
              paddingHorizontal: 20,
            }}
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {categories.map(category => (
              <CategoryItem
                key={category.id}
                isSelected={category.id === selectedCategory}
                onPress={() => handleSelectCategory(category.id)}
                activeOpacity={0.6}
                testID={`category-${category.id}`}
              >
                <Image
                  style={{ width: 56, height: 56 }}
                  source={{ uri: category.image_url }}
                />
                <CategoryItemTitle>{category.title}</CategoryItemTitle>
              </CategoryItem>
            ))}
          </CategorySlider>
        </CategoryContainer>
        <FoodsContainer>
          <Title>Pratos</Title>
          <FoodList>
            {foods.map(food => (
              <Food
                key={food.id}
                onPress={() => handleNavigate(food.id)}
                activeOpacity={0.6}
                testID={`food-${food.id}`}
              >
                <FoodImageContainer>
                  <Image
                    style={{ width: 88, height: 88 }}
                    source={{ uri: food.thumbnail_url }}
                  />
                </FoodImageContainer>
                <FoodContent>
                  <FoodTitle>{food.name}</FoodTitle>
                  <FoodDescription>{food.description}</FoodDescription>
                  <FoodPricing>{food.formattedPrice}</FoodPricing>
                </FoodContent>
              </Food>
            ))}
          </FoodList>
        </FoodsContainer>
      </ScrollView>
    </Container>
  );
};

export default Dashboard;
