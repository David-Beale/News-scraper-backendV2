import React, { useState, useEffect } from 'react';
import { Text, View, FlatList } from 'react-native';

import Moment from 'react-moment';


function handleHelpPress() {
  WebBrowser.openBrowserAsync(
    'https://github.com'
  );
}

const fetchData = async () => {
  return await fetch('http://10.154.87.48:4000?query={ headline(year: 2020 month:3 day:7 locale: "UK" ) { day month year newspaper id headline}}')
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

  useEffect(() => {
    try {
      fetchData().then(data => {
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
    <View>
      <Text>News Headlines
      </Text>
      <HeadlineList headlines={headlines} />
    </View>
  );
}




const HeadlineList = ({ headlines }) => {
  const style = {
    backgroundColor: "#2342ed"
  }
  const style2 = {
    backgroundColor: "red"
  }
  if (headlines) {
    return (
      <View onPress={handleHelpPress}>
        <FlatList
          style={style}
          data={headlines}
          renderItem={(item) => <HeadlineCard headline={item} />}
        >
        </FlatList>
      </View>
    )
  } else {
    return (
      <View
        style={style2}
      >
        <Text>Loading...</Text>
      </View>
    )
  }
};



const HeadlineCard = ({ headline }) => {
  return (
    <View onPress={handleHelpPress}>
      <Text>newspaper: {headline.item.newspaper}</Text>
      <Text>headline:{headline.item.headline}</Text>
      <Text>date: {headline.item.day}/{headline.item.month}/{headline.item.year}</Text>
    </View>
  )
}

// AppRegistry.registerComponent('MyApplication', () => App);

export default App;