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


  useEffect(() => {
    Api.getHeadlines()
      .then(result => {
        setHeadlines(result.data.headline)
      });
    Api.getWebsite().then(result => {
      console.log(result)
      setWebsite(result.data.html.htmlBody)
      setWebName(result.data.html.name)
      setWebLink(result.data.html.website)
      setWebCountry(result.data.html.country)
    })
  }, []);

  function handleClick (e) {
    e.preventDefault();
    let path = []
    let root = ''
    let currentNode = e.target
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
        console.log(currentNode)
        let id = currentNode.getAttribute('id')
        let thisClass = currentNode.getAttribute('class').trim()
        if (id) {
          id = '#' + id.trim();
        } else id = ''
        if (thisClass) {
          thisClass = thisClass.trim().split(' ').join('.')
          thisClass = '.' + thisClass
        } else thisClass = '';
        root = (id + thisClass);
      }
      currentNode = parentNode;
      parentNode = currentNode.parentNode;
      children = parentNode.children;
    }

    let targetNode = document.querySelector(root);
    for (let i = path.length - 2; i >= 0; i--) {
      targetNode = targetNode.children[path[i]]
    }
    // console.log(targetNode)

    // console.log(path)
    console.log(status)
    if (status === 1) {
      setTitleRoot(root)
      setTitlePath(path)
      setTitle(targetNode.innerText)
    } else if (status === 2) {
      setSummaryPath(path)
      setSummary(targetNode.innerText)
    } else if (status === 3) {
      console.log((targetNode.parentNode.getAttribute('src')))
      setImagePath(path)
      if (targetNode.getAttribute('src') && targetNode.getAttribute('src')[0] === 'h') {
        setImage(targetNode.src)
      } else if (targetNode.getAttribute('data-src') && targetNode.getAttribute('data-src')[0] === 'h') {
        setImage(targetNode.getAttribute('data-src'))
      } else if (targetNode.parentNode.getAttribute('src') && targetNode.parentNode.getAttribute('src')[0] === 'h') {
        setImage(targetNode.parentNode.getAttribute('src'))
      } else if (targetNode.parentNode.getAttribute('data-src') && targetNode.parentNode.getAttribute('data-src')[0] === 'h') {
        setImage(targetNode.parentNode.getAttribute('data-src'))
      }
    } else if (status === 4) {
      if (targetNode.href) {
        setLinkPath(path)
        setLink(webLink + targetNode.href.slice(21))
      } else if (targetNode.parentNode.href) {
        setLinkPath(path)
        setLink(webLink + targetNode.parentNode.href.slice(21))
      }
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
    Api.saveNewFeed(webLink, webName, webCountry, titlePath, titleRoot, summaryPath, linkPath, imagePath)
  }

  return (
    <div>
      <div className="app-container">
        <div className="main-header">
          <h1 className="header">Headlines</h1>
          <button onClick={toggleShow} >Add new feed</button>
        </div>
        {show &&
          <HeadlineList
            headlines={headlines}
          />}
        {!show &&
          <div>
            <div className="addNew">
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
                  </div>;
                  case 4: return <div>
                    <p>Select a Link</p>
                    <p>{link}</p>
                  </div>;
                }
              })()}
              <button onClick={changeStatus} >Next</button>
              <button onClick={submit} >Submit</button>
            </div>
            <div id="externalMaster" className="external" onClick={handleClick} >{renderHTML(website)}</div>
            {/* <div dangerouslySetInnerHTML={{ __html: JSON.stringify() }} /> */}
            {/* <div className="external" onClick={handleClick} >{website}</div> */}
          </div>
        }
      </div>
    </div>
  );
}

export default App;
