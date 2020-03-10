import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, FlatList, Linking, ScrollView, Image, ToolbarAndroid } from 'react-native';
import { AppRegistry } from 'react-native';

import HTML from 'react-native-render-html';
import DateTimePicker from '@react-native-community/datetimepicker';

import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { Card, Title, Paragraph, Appbar, Button, TextInput, Surface, FAB, ActivityIndicator, Avatar } from 'react-native-paper';


const theme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    primary: '#2196F3',
    accent: '#f44336',
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
  console.log('render app')
  const [headlines, setHeadlines] = useState([]);
  const [dateFull, setDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [locale, setLocale] = useState("UK");
  const [loadhtml, setloadhtml] = useState(false);
  const [loadingHeadlines, setLoadingHeadlines] = useState(true);



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
          <Avatar.Image size={47} source={require('./assets/icon.png')} />
          {/* <Appbar.Content
            title={"News Feeds " + locale}
          /> */}

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
          setloadhtml={setloadhtml}
        />
      </View>
      <FAB
        style={style.fab}
        big
        icon="plus"
        visible={!loadhtml}
        onPress={() => showHtml()}
      />
    </PaperProvider>
  );
}




const HeadlineList = ({ headlines, loadhtml, loadingHeadlines, setloadhtml }) => {

  console.log('render headline list')

  const [formValue, setFormValue] = useState('');
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

  let localFormState = formState;

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
            <View style={{ flexDirection: "row" }}>
              <Button
                onPress={() => { localFormState++; setFormState(localFormState); setFormValue('') }}
                disabled={formState >= 3}
              >Next</Button>
              <Button
                onPress={() => { setFormState(0); setloadhtml(false) }}
              >Submit</Button>
            </View>
          </View>
        </View>}
        <FlatList
          data={headlines}
          contentContainerStyle={style.container}
          renderItem={(item) => <HeadlineCard headline={item} />}
        />
      </View >
    )
  } else {
    return (
      <View style={style.loadingContainer}>
        <ActivityIndicator style={{ marginTop: 200 }} size="large" animating={true} color={"red"} />
      </View>
    )
  }
};



const HeadlineCard = ({ headline }) => {

  console.log('render headline card')

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
    paddingBottom: 250
  },
  card: {
    margin: 10,
    elevation: 7
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
  },
  fab: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    margin: 16
  }
});

AppRegistry.registerComponent('MyApplication', () => App);

export default App;