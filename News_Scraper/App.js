import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, FlatList, Linking, ScrollView, Image, ToolbarAndroid, Dimensions } from 'react-native';
import { AppRegistry, TouchableOpacity } from 'react-native';
import Api from './api-client';

import RenderHTML from 'react-native-render-html';
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

function handleHelpPress (url) {

  Linking.openURL(url);
}


const fetchData = async (date, month, year, locale) => {
  // let url = `http://localhost:4000/?query={ headline(year: ${year} month:${month} day:${date} locale: "${locale ? locale : "UK"}" ) { day month year newspaper id headline website image}}`;
  let url = `http://localhost:4000/?query={ headline(year: ${year} month:${month} day:${date} locale: "${locale ? locale : "UK"}" )
  {day 
  month 
  year 
  newspaper 
  id
  headline }
}`
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
  const [loadExternal, setLoadExternal] = useState(false);



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
        <Appbar.Header style={{ justifyContent: "space-between" }}>
          <Avatar.Image size={42} source={require('./assets/newsFeeds.png')} style={{ marginLeft: 12 }} />
          {/* <Appbar.Content
            title={"News Feeds " + locale}
          /> */}
          <View style={{ flexDirection: "row" }} >
            <Button
              style={style.headerButton}
              mode={"outlined"}
              onPress={() => changeLocale()}
            >
              {locale}
            </Button>
            <Button
              style={style.headerButton}
              mode={"outlined"}
              onPress={() => setShow(true)}
            >
              {date}/{month}/{year}
            </Button>
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
        <AddFeed
          loadhtml={loadhtml}
          setloadhtml={setloadhtml}
          loadExternal={loadExternal}
          setLoadExternal={setLoadExternal}
        />
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

const AddFeed = ({ loadhtml, setloadhtml, loadExternal, setLoadExternal }) => {
  const [formValue, setFormValue] = useState('');
  const [formState, setFormState] = useState(0);
  const [httpAddress, setHttpAddress] = useState('');
  const [httpName, setHttpName] = useState('');
  const [httpLocale, setHttpLocale] = useState('');
  const [website, setWebsite] = useState('');
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [image, setImage] = useState('');
  const [link, setLink] = useState('');
  const [status, setStatus] = useState(1);
  const [titleRoot, setTitleRoot] = useState('');
  const [titlePath, setTitlePath] = useState([]);
  const [summaryPath, setSummaryPath] = useState([]);
  const [linkPath, setLinkPath] = useState([]);
  const [imagePath, setImagePath] = useState([]);
  const [selectedNode, setSelectedNode] = useState([]);
  const [arrayOfOptions, setArrayOfOptions] = useState([]);
  const [arrayOfNodes, setArrayOfNodes] = useState([]);
  const [showOptions, setShowOptions] = useState(false);
  const [currentOption, setCurrentOption] = useState(1);
  const [imageTag, setImageTag] = useState('');

  function handleClick (e) {
    e.preventDefault();
    let currentNode = e.target
    let [path, root] = findPath(currentNode)
    console.log(e.target)
    let targetNode = document.querySelector(root);
    for (let i = path.length - 2; i >= 0; i--) {
      targetNode = targetNode.children[path[i]]
    }
    setSelectedNode(targetNode)
    if (status === 1) {
      setTitleRoot(root)
      setTitlePath(path)
      setTitle(targetNode.innerText)
    } else if (status === 2) {
      setSummaryPath(path)
      setSummary(targetNode.innerText)
    } else if (status === 3) {
      if (targetNode.getAttribute('src') && targetNode.getAttribute('src')[0] === 'h') {
        setImage(targetNode.src)
        setImageTag('src')
      } else if (targetNode.getAttribute('data-src') && targetNode.getAttribute('data-src')[0] === 'h') {
        setImage(targetNode.getAttribute('data-src'))
        setImageTag('data-src')
      } else if (targetNode.parentNode.getAttribute('src') && targetNode.parentNode.getAttribute('src')[0] === 'h') {
        setImage(targetNode.parentNode.getAttribute('src'))
        setImageTag('src')
        path.shift()
      } else if (targetNode.parentNode.getAttribute('data-src') && targetNode.parentNode.getAttribute('data-src')[0] === 'h') {
        setImage(targetNode.parentNode.getAttribute('data-src'))
        setImageTag('data-src')
        path.shift()
      }
      setImagePath(path)
    } else if (status === 4) {
      if (targetNode.href) {
        if (targetNode.href[7] === 'l') setLink(webLink + targetNode.href.slice(21))
        else setLink(targetNode.href)
      } else if (targetNode.parentNode.href) {
        path.shift();
        if (targetNode.parentNode.href[7] === 'l') setLink(webLink + targetNode.parentNode.href.slice(21))
        else setLink(targetNode.parentNode.href)
      }
      setLinkPath(path)
    }
  }
  function findPath (currentNode) {
    let path = [];
    let root = '';
    let parentNode = currentNode.parentNode
    let children = parentNode.children
    while (currentNode.getAttribute('id') !== "externalMaster") {
      console.log(currentNode)
      let n;
      for (let i = 0; i < children.length; i++) {
        if (children[i] === currentNode) {
          n = i;
          i = children.length
        }
      }
      path.push(n)
      if (parentNode.getAttribute('id') === "externalMaster") {
        let id = currentNode.getAttribute('id')
        let thisClass = currentNode.getAttribute('class')
        if (id) {
          id = '#' + id.trim();
          root = id
        }
        else if (thisClass) {
          thisClass = thisClass.trim().split(' ').join('.')
          thisClass = '.' + thisClass
          root = thisClass
        };
      }
      currentNode = parentNode;
      parentNode = currentNode.parentNode;
      children = parentNode.children;
    }
    return [path, root]
  }
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  function deepSearch () {
    let currentNode = selectedNode.parentNode
    let localArrayOfOptions = []
    let localArrayOfNodes = []

    function search (currentNode) {
      if (status <= 2 && currentNode.innerText && currentNode.innerText.trim().length > 5) {
        localArrayOfOptions.push(currentNode.innerText.trim())
        localArrayOfNodes.push(currentNode)
      }
      else if (status === 3) {
        if (currentNode.getAttribute('src') && currentNode.getAttribute('src')[0] === 'h') {
          localArrayOfOptions.push(currentNode.getAttribute('src'))
          setImageTag('src')
          localArrayOfNodes.push(currentNode)
        }
        if (currentNode.getAttribute('data-src') && currentNode.getAttribute('data-src')[0] === 'h') {
          localArrayOfOptions.push(currentNode.getAttribute('data-src'))
          setImageTag('data-src')
          localArrayOfNodes.push(currentNode)
        }
        if (currentNode.getAttribute('srcset') && currentNode.getAttribute('srcset')[0] === 'h') {
          localArrayOfOptions.push(currentNode.getAttribute('srcset'))
          setImageTag('srcset')
          localArrayOfNodes.push(currentNode)
        }
        if (currentNode.getAttribute('data-src-md') && currentNode.getAttribute('data-src-md')[0] === 'h') {
          localArrayOfOptions.push(currentNode.getAttribute('data-src-md'))
          setImageTag('data-src-md')
          localArrayOfNodes.push(currentNode)
        }
      }

      else if (status === 4 && currentNode.href) {
        if (currentNode.href[7] === 'l') localArrayOfOptions.push(webLink + currentNode.href.slice(21))
        else localArrayOfOptions.push(currentNode.href)

        localArrayOfNodes.push(currentNode)
      }
      for (let i = 0; i < currentNode.children.length; i++) {
        search(currentNode.children[i])
      }
    }
    search(currentNode)
    if (!localArrayOfOptions.length) alert("sorry no options available")
    else {
      setArrayOfOptions(localArrayOfOptions)
      setArrayOfNodes(localArrayOfNodes)
      setShowOptions(true)
    }
  }

  function changeStatus () {
    if (status <= 4) {
      setStatus(status + 1)
    }
  }
  function submit () {
    Api.saveNewFeed(webLink, webName, webCountry, titlePath, titleRoot, summaryPath, linkPath, imagePath, imageTag)
  }
  function previousOption () {
    if (currentOption > 1) setCurrentOption(currentOption - 1)
  }
  function nextOption () {
    if (currentOption < arrayOfOptions.length) setCurrentOption(currentOption + 1)
  }
  function selectOption () {
    let node = arrayOfNodes[currentOption - 1]
    let [path, root] = findPath(node)
    if (status === 1) {
      setTitleRoot(root)
      setTitlePath(path)
      setTitle(arrayOfOptions[currentOption - 1])
    } else if (status === 2) {
      setSummaryPath(path)
      setSummary(arrayOfOptions[currentOption - 1])
    } else if (status === 3) {
      setImagePath(path)
      setImage(arrayOfOptions[currentOption - 1])
    } else if (status === 4) {
      setLinkPath(path)
      setLink(arrayOfOptions[currentOption - 1])
    }
    setCurrentOption(1)
    setShowOptions(false)
  }

  let formLabel = '';
  switch (formState) {
    case 0:
      formLabel = "Input website address"
      break;
    case 1:
      formLabel = "Select a short name for the site"
      break;
    case 2:
      formLabel = "select country of site"
      break;
    default:
      break;
  }
  let localFormState = formState;
  return (
    <View >
      {loadhtml && !loadExternal && <View>
        <View >
          <TextInput
            label={formLabel}
            value={formValue}
            onChangeText={text => { setFormValue(text); console.log(formValue) }}
          />
          <View style={{ flexDirection: "row", height: 60 }}>
            <Button
              mode="outlined"
              style={{ margin: 12 }}
              onPress={() => {
                switch (formState) {
                  case 0:
                    setHttpAddress(formValue)
                    break;
                  case 1:
                    setHttpName(formValue)
                    break;
                  case 2:
                    setHttpLocale(formValue)
                    break;
                  default:
                    break;
                };
                localFormState++; setFormState(localFormState); setFormValue('');
              }}
              disabled={formState >= 2}
            >Next</Button>
            {formState === 2 && <Button
              mode="outlined"
              style={{ margin: 12 }}
              onPress={() => {
                setFormState(0); setLoadExternal(true);
                Api.getWebsite(httpAddress).then(result => {
                  setWebsite(result.data.html.htmlBody)
                })
              }}
            >Submit</Button>
            }
          </View>
        </View>
      </View>}
      {loadhtml && loadExternal &&
        <View >
          <View>
            {!showOptions &&
              <View>
                {(() => {
                  switch (status) {
                    case 1: return <View>
                      <Paragraph>Select a title</Paragraph>
                      <Paragraph>{title}</Paragraph>
                    </View>;
                    case 2: return <View>
                      <Paragraph>Select a Summary</Paragraph>
                      <Paragraph>{summary}</Paragraph>
                    </View>;
                    case 3: return <View>
                      <Paragraph>Select a Image</Paragraph>
                      <Paragraph>{image}</Paragraph>
                      <Image source={image} style={{ width: 100, height: 100 }} />
                    </View>;
                    case 4: return <View>
                      <Paragraph>Select a Link</Paragraph>
                      <Paragraph>{link}</Paragraph>
                    </View>;
                  }
                })()}
                <Button onPress={changeStatus} >Next</Button>
                <Button onPress={submit} >Submit</Button>
                <Button onPress={deepSearch} >Not what you are looking for?</Button>
              </View>
            }
            {showOptions &&
              <View>
                <View>
                  Option {currentOption} out of {arrayOfOptions.length}
                  <View>
                    {arrayOfOptions[currentOption - 1]}
                    {status === 3 &&
                      <Image source={arrayOfOptions[currentOption - 1]} style={{ height: 100 }} />
                    }
                  </View>
                </View>
                <Button onPress={previousOption} >Previous</Button>
                <Button onPress={selectOption} >Select</Button>
                <Button onPress={nextOption} >Next</Button>
              </View>
            }
            <TouchableOpacity onPress={(event) => {
              console.log('click')
              handleClick(event)

            }}>
              <RenderHTML id="externalMaster" html={website} imagesMaxWidth={Dimensions.get('window').width} />
            </TouchableOpacity>
          </View>
        </View>
      }
    </View >
  )
}


const HeadlineList = ({ headlines, loadhtml, loadingHeadlines, setloadhtml }) => {

  console.log('render headline list')


  if (!loadingHeadlines && !loadhtml) {
    return (
      <View >
        <FlatList
          data={headlines}
          contentContainerStyle={style.container}
          renderItem={(item) => <HeadlineCard headline={item} />}
        />
      </View >
    )
  } else if (!loadhtml) {
    return (
      <View style={style.loadingContainer}>
        <ActivityIndicator style={{ marginTop: 200 }} size="large" animating={true} color={"red"} />
      </View>
    )
  } else return (
    <View></View>
  )
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