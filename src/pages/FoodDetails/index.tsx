import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useLayoutEffect,
} from 'react';
import { Image } from 'react-native';

import Icon from 'react-native-vector-icons/Feather';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import formatValue from '../../utils/formatValue';

import api from '../../services/api';

import {
  Container,
  Header,
  ScrollContainer,
  FoodsContainer,
  Food,
  FoodImageContainer,
  FoodContent,
  FoodTitle,
  FoodDescription,
  FoodPricing,
  AdditionalsContainer,
  Title,
  TotalContainer,
  AdditionalItem,
  AdditionalItemText,
  AdditionalQuantity,
  PriceButtonContainer,
  TotalPrice,
  QuantityContainer,
  FinishOrderButton,
  ButtonText,
  IconContainer,
} from './styles';

interface Params {
  id: number;
}

interface Extra {
  id: number;
  name: string;
  value: number;
  quantity: number;
}

interface Food {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  formattedPrice: string;
  extras: Extra[];
}

const FoodDetails: React.FC = () => {
  // Definindo os estados para o prato, os extras, quantidade e a indicação se é ou não favorito
  const [food, setFood] = useState({} as Food);
  const [extras, setExtras] = useState<Extra[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [foodQuantity, setFoodQuantity] = useState(1);

  const navigation = useNavigation();
  const route = useRoute();

  const routeParams = route.params as Params;

  useEffect(() => {
    async function loadFood(): Promise<void> {
      // Carregando o prato escolhido pelo seu id
      const response = await api.get<Food>(`/foods/${routeParams.id}`);
      // Definindo os dados do prato
      setFood({
        ...response.data,
        formattedPrice: formatValue(response.data.price),
      });
      // Definindo os dados dos extras
      setExtras(
        // Definindo o tipo como sendo o 'Extra' menos o parâmetro de quantidade, que não vem da API
        response.data.extras.map((extra: Omit<Extra, 'quantity'>) => ({
          ...extra,
          // Inicializando a quantidade de extras
          quantity: 0,
        })),
      );
    }
    // Carregando os dados do prato
    loadFood();
  }, [routeParams]);

  // Verificando se o prato é um favorito
  useEffect(() => {
    async function loadFavorite(): Promise<void> {
      // Carregando o prato escolhido pelo seu id
      try {
        await api.get(`/favorites/${routeParams.id}`);
        // Caso seja retornado, o prato é um favorito
        setIsFavorite(true);
      } catch (err) {
        // Caso ocorra algum erro, o prato não é um favorito
      }
    }
    // Chamando a função criada
    loadFavorite();
  }, [routeParams]);

  function handleIncrementExtra(id: number): void {
    // Adicionando uma unidade do extra pelo ID
    setExtras(
      // Percorrendo os extras do pedido
      extras.map(extra =>
        extra.id == id
          // Caso possua o mesmo ID, adicionamos uma unidade
          ? { ...extra, quantity: extra.quantity + 1 }
          // Caso contrário mantemos o item como está
          : extra)
    )
  }

  function handleDecrementExtra(id: number): void {
    // Primeiro, verificamos se a quantidade do produto é maior que 0
    const findExtra = extras.find(extra => extra.id == id);
    // Se não encontrar ou se a quantidade for zero, encerramos
    if (!findExtra) return;
    if (findExtra.quantity == 0) return;
    // Removendo uma unidade do extra pelo ID
    setExtras(
      // Percorrendo os extras do pedido
      extras.map(extra =>
        extra.id == id
          // Caso possua o mesmo ID, removemos uma unidade
          ? { ...extra, quantity: extra.quantity - 1 }
          // Caso contrário mantemos o item como está
          : extra)
    )
  }

  function handleIncrementFood(): void {
    // Aumentando a quantidade de pratos
    setFoodQuantity(foodQuantity + 1);
  }

  function handleDecrementFood(): void {
    // Diminuindo a quantidade de pratos, caso haja mais de 1
    if (foodQuantity == 1) return;
    setFoodQuantity(foodQuantity - 1);
  }

  // Função para marcar/desmarcar um prato como favorito
  const toggleFavorite = useCallback(async () => {
    // Caso seja um favorito, removemos
    if (isFavorite) {
      await api.delete(`/favorites/${food.id}`);
    }
    // Caso não seja um favorito, adicionamos
    else {
      await api.post(`/favorites`, food);
    }
    // Alterando o estado local
    setIsFavorite(!isFavorite);
  }, [isFavorite, food]);

  // Função para definir a variável com o valor total do pedido
  const cartTotal = useMemo(() => {
    // Calculando o total com extras
    const extraTotal = extras.reduce((accumulator, extra) => {
      // Retornando o acumulador acrescido do valor total do extra
      return accumulator + (extra.quantity * extra.value);
    },
      // Definindo o valor inicial para o acumulador
      0);

    // Calculando o total com o prato
    const foodTotal = food.price;

    // Retornando o valor dos pratos com extras multiplicado pela quantidade de pratos no pedido
    return formatValue((extraTotal + foodTotal) * foodQuantity);
  }, [extras, food, foodQuantity]);

  // Função para salvar o pedido na API
  async function handleFinishOrder(): Promise<void> {
    // Pegando a quantidade de pedidos já feitos
    const response = await api.get('/orders');
    const order_id = response.data.length + 1;
    // Chamando a função para adicionar o pedido à API
    await api.post('/orders', {
      // Definindo os dados a serem passados no pedido
      ...food,
      // Sobrescrevendo o id do prato com sendo o do pedido e adicionado o do prato
      product_id: food.id,
      id: order_id,
      // Adicionando a quantidade e o preço total
      quantity: foodQuantity,
      total_price: cartTotal,
    });
  }

  // Calculate the correct icon name
  const favoriteIconName = useMemo(
    () => (isFavorite ? 'favorite' : 'favorite-border'),
    [isFavorite],
  );

  useLayoutEffect(() => {
    // Add the favorite icon on the right of the header bar
    navigation.setOptions({
      headerRight: () => (
        <MaterialIcon
          name={favoriteIconName}
          size={24}
          color="#FFB84D"
          onPress={() => toggleFavorite()}
        />
      ),
    });
  }, [navigation, favoriteIconName, toggleFavorite]);

  return (
    <Container>
      <Header />

      <ScrollContainer>
        <FoodsContainer>
          <Food>
            <FoodImageContainer>
              <Image
                style={{ width: 327, height: 183 }}
                source={{
                  uri: food.image_url,
                }}
              />
            </FoodImageContainer>
            <FoodContent>
              <FoodTitle>{food.name}</FoodTitle>
              <FoodDescription>{food.description}</FoodDescription>
              <FoodPricing>{food.formattedPrice}</FoodPricing>
            </FoodContent>
          </Food>
        </FoodsContainer>
        <AdditionalsContainer>
          <Title>Adicionais</Title>
          {extras.map(extra => (
            <AdditionalItem key={extra.id}>
              <AdditionalItemText>{extra.name}</AdditionalItemText>
              <AdditionalQuantity>
                <Icon
                  size={15}
                  color="#6C6C80"
                  name="minus"
                  onPress={() => handleDecrementExtra(extra.id)}
                  testID={`decrement-extra-${extra.id}`}
                />
                <AdditionalItemText testID={`extra-quantity-${extra.id}`}>
                  {extra.quantity}
                </AdditionalItemText>
                <Icon
                  size={15}
                  color="#6C6C80"
                  name="plus"
                  onPress={() => handleIncrementExtra(extra.id)}
                  testID={`increment-extra-${extra.id}`}
                />
              </AdditionalQuantity>
            </AdditionalItem>
          ))}
        </AdditionalsContainer>
        <TotalContainer>
          <Title>Total do pedido</Title>
          <PriceButtonContainer>
            <TotalPrice testID="cart-total">{cartTotal}</TotalPrice>
            <QuantityContainer>
              <Icon
                size={15}
                color="#6C6C80"
                name="minus"
                onPress={handleDecrementFood}
                testID="decrement-food"
              />
              <AdditionalItemText testID="food-quantity">
                {foodQuantity}
              </AdditionalItemText>
              <Icon
                size={15}
                color="#6C6C80"
                name="plus"
                onPress={handleIncrementFood}
                testID="increment-food"
              />
            </QuantityContainer>
          </PriceButtonContainer>

          <FinishOrderButton onPress={() => handleFinishOrder()}>
            <ButtonText>Confirmar pedido</ButtonText>
            <IconContainer>
              <Icon name="check-square" size={24} color="#fff" />
            </IconContainer>
          </FinishOrderButton>
        </TotalContainer>
      </ScrollContainer>
    </Container>
  );
};

export default FoodDetails;
