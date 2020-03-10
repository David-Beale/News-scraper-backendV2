import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, FlatList, Linking, ScrollView, Image } from 'react-native';
import { AppRegistry } from 'react-native';

import HTML from 'react-native-render-html';
import DateTimePicker from '@react-native-community/datetimepicker';

import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { Card, Title, Paragraph, Appbar, Button, TextInput } from 'react-native-paper';


const theme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    primary: '#BBDEFB',
    accent: 'green',
  },
};

let date = new Date().getDate();
let month = new Date().getMonth() + 1;
let year = new Date().getFullYear();

function handleHelpPress(url) {

  Linking.openURL(url);
}


const fetchData = async (date, month, year, locale) => {
  let url = `http://10.154.86.199:4000?query={ headline(year: ${year} month:${month} day:${date} locale: "${locale ? locale : "UK"}" ) { day month year newspaper id headline website image}}`;
  return await fetch(url)
    .then(res => {
      if (res.status < 400) {
        return res.json()
      }
      else {
        return Promise().reject();
      }
    });
};

const App = () => {

  const [headlines, setHeadlines] = useState([]);
  const [dateFull, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [locale, setLocale] = useState("UK");
  const [loadhtml, setloadhtml] = useState(false);
  const [loadingHeadlines, setLoadingHeadlines] = useState(true);
  const [formState, setFormState] = useState(0);



  let formLabel = '';
  switch (formState) {
    case 0:
      formLabel = "input website address"
      break;
    case 1:
      formLabel = "select title"
      break;
    case 2:
      formLabel = "select summary"
      break;
    case 3:
      formLabel = "select image"
      break;
    default:
      break;
  }



  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || dateFull;
    if (selectedDate) {
      year = selectedDate.getFullYear();
      month = selectedDate.getMonth() + 1;
      date = selectedDate.getDate();
    }
    fetchData(date, month, year, locale)
      .then(data => setHeadlines(data.data.headline))
      .catch((error) => {
        console.log("Api call error");
        alert(error.message);
      });
    setShow(Platform.OS === 'ios');
    setDate(currentDate);
  };
  const showHtml = () => {
    const opposite = !loadhtml;
    setloadhtml(opposite);
  }

  const changeLocale = () => {
    let instanceOfLocale = locale
    if (locale !== "UK") {
      setLocale("UK");
      instanceOfLocale = "UK"

    } else {
      setLocale("ES");
      instanceOfLocale = "ES"
    }

    fetchData(date, month, year, instanceOfLocale).then(data => {
      setHeadlines(data.data.headline)
    })

      .catch((error) => {
        console.log("Api call error");
        alert(error.message);
      });
  };


  useEffect(() => {
    try {
      fetchData(date, month, year).then(data => {
        setHeadlines(data.data.headline)
        if (data) setLoadingHeadlines(false);
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
            title={"News Feeds " + locale}
          />
          <View style={style.loadingContainer}>
            <Button mode={"contained"} onPress={() => showHtml()}>+</Button>
          </View>
          <View >
            <Button style={style.headerButton} mode={"contained"} onPress={() => changeLocale()}>{locale}</Button>
          </View>
          <View >
            <Button style={style.headerButton} mode={"contained"} onPress={() => setShow(true)}>{date}/{month}/{year}</Button>
          </View>
          {show && (
            <DateTimePicker
              testID="dateTimePicker"
              timeZoneOffsetInMinutes={0}
              value={dateFull}
              mode="date"
              is24Hour={true}
              display="calendar"
              onChange={onChange}
              maximumDate={new Date()}
            />
          )}
        </Appbar.Header>
        <HeadlineList
          headlines={headlines}
          loadhtml={loadhtml}
          loadingHeadlines={loadingHeadlines}
          formLabel={formLabel}
          formState={formState}
          setFormState={setFormState}
        />
      </View>
    </PaperProvider>
  );
}




const HeadlineList = ({ headlines, loadhtml, loadingHeadlines, formState, formLabel, setFormState }) => {
  const [formValue, setFormValue] = useState('');
  if (!loadingHeadlines) {
    return (
      <View >
        {loadhtml && <View>
          <View >
            <TextInput
              label={formLabel}
              value={formValue}
              onChangeText={text => { setFormValue(text); console.log(formValue) }}
            />

          </View>
        </View>}
        <FlatList
          data={headlines}
          contentContainerStyle={style.container}
          renderItem={(item) => <HeadlineCard headline={item} />}
        >
        </FlatList>
      </View >
    )
  } else {
    return (
      <View style={style.loadingContainer}>
        <Image
          style={{ width: 400, height: 100, marginTop: 300 }}
          source={{ uri: 'https://tutorials.cloudboost.io/public/img/loading.gif' }}
        />
      </View>
    )
  }
};



const HeadlineCard = ({ headline }) => {
  return (
    <View >
      <Card onPress={() => handleHelpPress(headline.item.website)} style={style.card}>
        <Card.Content>
          {headline.item.image && <Card.Cover source={{ uri: headline.item.image }} />}
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
    backgroundColor: "#E3F2FD",
    margin: 10
  },
  title: {
    fontSize: 24
  },
  small: {
    fontSize: 10,
    fontStyle: 'italic'
  },
  headerButton: {
    backgroundColor: "#B3E5FC",
    marginLeft: 7,
    marginRight: 7
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column"
  }
});

AppRegistry.registerComponent('MyApplication', () => App);

export default App;