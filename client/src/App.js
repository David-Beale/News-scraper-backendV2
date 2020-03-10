import React, { useState, useEffect } from 'react';
import './App.css';
import HeadlineList from './headline-list/headline-list';
import Api from './api-client';
import renderHTML from 'react-render-html';
import apiClient from './api-client';


function App () {

  const [headlines, setHeadlines] = useState([]);
  const [website, setWebsite] = useState('');
  const [webName, setWebName] = useState('');
  const [webLink, setWebLink] = useState('');
  const [webCountry, setWebCountry] = useState('');
  const [show, setShow] = useState(true);
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


  useEffect(() => {
    Api.getHeadlines()
      .then(result => {
        setHeadlines(result.data.headline)
      });
    Api.getWebsite().then(result => {
      setWebsite(result.data.html.htmlBody)
      setWebName(result.data.html.name)
      setWebLink(result.data.html.website)
      setWebCountry(result.data.html.country)
    })
  }, []);
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  function handleClick (e) {
    e.preventDefault();
    let currentNode = e.target
    let [path, root] = findPath(currentNode)

    let targetNode = document.querySelector(root);
    for (let i = path.length - 2; i >= 0; i--) {
      targetNode = targetNode.children[path[i]]
    }
    // console.log(targetNode)

    // console.log(path)
    // console.log(status)
    setSelectedNode(targetNode)
    if (status === 1) {
      setTitleRoot(root)
      setTitlePath(path)
      setTitle(targetNode.innerText)
    } else if (status === 2) {
      setSummaryPath(path)
      setSummary(targetNode.innerText)
    } else if (status === 3) {
      // console.log((targetNode.parentNode.getAttribute('src')))
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
    console.log(localArrayOfOptions)
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
      console.log(status)
    }
  }
  function toggleShow () {
    setShow(!show)
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

  return (
    <div>
      <div className="app-container">
        <div className="main-header">
          <h1 className="header">Headlines</h1>
          <button onClick={toggleShow}  >Add new feed</button>
        </div>
        {show &&
          <HeadlineList
            headlines={headlines}
          />}
        {!show &&
          <div>
            <div className="addNew">
              {!showOptions &&
                <div>
                  {(() => {
                    switch (status) {
                      case 1: return <div>
                        <p>Select a title</p>
                        <p>{title}</p>
                      </div>;
                      case 2: return <div>
                        <p>Select a Summary</p>
                        <p>{summary}</p>
                      </div>;
                      case 3: return <div>
                        <p>Select a Image</p>
                        <p>{image}</p>
                        <img src={image} style={{ width: 100, height: 100 }}></img>
                      </div>;
                      case 4: return <div>
                        <p>Select a Link</p>
                        <p>{link}</p>
                      </div>;
                    }
                  })()}
                  <button onClick={changeStatus} >Next</button>
                  <button onClick={submit} >Submit</button>
                  <button onClick={deepSearch} >Not what you are looking for?</button>
                </div>
              }
              {showOptions &&
                <div>
                  <div>
                    Option {currentOption} out of {arrayOfOptions.length}
                    <div>
                      {arrayOfOptions[currentOption - 1]}
                      {status === 3 &&
                        <img src={arrayOfOptions[currentOption - 1]} style={{ height: 100 }}></img>
                      }
                    </div>
                  </div>
                  <button onClick={previousOption} >Previous</button>
                  <button onClick={selectOption} >Select</button>
                  <button onClick={nextOption} >Next</button>
                </div>
              }
            </div>
            <div id="externalMaster" className="external" onClick={handleClick} >{renderHTML(website)}</div>
            {/* <div dangerouslySetInnerHTML={{ __html: website }} /> */}
            {/* <div className="external" onClick={handleClick} >{website}</div> */}
          </div>
        }
      </div>
    </div>
  );
}

export default App;
