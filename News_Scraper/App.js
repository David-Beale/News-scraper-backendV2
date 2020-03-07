import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, FlatList, Linking } from 'react-native';
import { AppRegistry } from 'react-native';

import DateTimePicker from '@react-native-community/datetimepicker';

import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { Card, Title, Paragraph, Appbar, Button } from 'react-native-paper';


const theme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    primary: '#FF8A65',
    accent: 'green',
  },
};

let date = new Date().getDate();
let month = new Date().getMonth() + 1;
let year = new Date().getFullYear();

function handleHelpPress() {
  Linking.openURL(
    'https://github.com'
  );
}

const fetchData = async (date, month, year) => {
  return await fetch(`http://10.154.87.48:4000?query={ headline(year: ${year} month:${month} day:${date} locale: "UK" ) { day month year newspaper id headline}}`)
    .then(res => {
      if (res.status < 400) {
        return res.json()
      }
      else {
        return Promise().reject();
      }
    });
}

const App = () => {
  const [headlines, setHeadlines] = useState([]);
  const [dateFull, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || dateFull;
    if (selectedDate) {
      year = selectedDate.getFullYear();
      month = selectedDate.getMonth() + 1;
      date = selectedDate.getDate();
    }
    fetchData(date, month, year).then(data => setHeadlines(data.data.headline)).catch((error) => {
      console.log("Api call error");
      alert(error.message);
    });
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
  };


  useEffect(() => {
    try {
      fetchData(date, month, year).then(data => {
        setHeadlines(data.data.headline)
      })
        .catch((error) => {
          console.log("Api call error");
          alert(error.message);
        });
    } catch (e) {
      throw e;
    }
  }, []);
  return (
    <PaperProvider theme={theme}>
      <View>
        <Appbar.Header>
          <Appbar.Content
            title="News Feeds"
          />
          <View>
            <Button mode={"contained"} onPress={() => setShow(true)}>{date}/{month}/{year}</Button>
          </View>
          {show && (
            <DateTimePicker
              testID="dateTimePicker"
              timeZoneOffsetInMinutes={0}
              value={dateFull}
              mode={'date'}
              is24Hour={true}
              display="calendar"
              onChange={onChange}
              maximumDate={new Date()}
            />
          )}
        </Appbar.Header>
        <HeadlineList headlines={headlines} />
      </View>
    </PaperProvider>
  );
}




const HeadlineList = ({ headlines }) => {

  if (headlines) {
    return (
      <View >
        <FlatList
          data={headlines}
          contentContainerStyle={style.container}
          renderItem={(item) => <HeadlineCard headline={item} />}
        >
        </FlatList>
      </View>
    )
  } else {
    return (
      <View
      >
        <Text>Loading...</Text>
      </View>
    )
  }
};



const HeadlineCard = ({ headline }) => {
  return (
    <View >
      <Card onPress={() => handleHelpPress()} style={style.card}>
        <Card.Content>
          <Card.Cover source={{ uri: 'https://picsum.photos/700' }} />
          <Title style={style.title}>{headline.item.newspaper}</Title>
          <Paragraph >{headline.item.headline}</Paragraph>
          <Paragraph style={style.small}>{headline.item.day}/{headline.item.month}/{headline.item.year}</Paragraph>
        </Card.Content>
      </Card>
    </View>
  )
}
const style = StyleSheet.create({
  container: {
    paddingBottom: 300
  },
  card: {
    backgroundColor: "#FBE9E7",
    margin: 10
  },
  title: {
    fontSize: 24
  },
  small: {
    fontSize: 10,
    fontStyle: 'italic'
  }
});

AppRegistry.registerComponent('MyApplication', () => App);

export default App;