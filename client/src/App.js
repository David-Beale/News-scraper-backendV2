import React, { useState, useEffect } from 'react';
import './App.css';
import HeadlineList from './headline-list/headline-list';
import Api from './api-client';
import renderHTML from 'react-render-html';


function App () {

  const [headlines, setHeadlines] = useState([]);
  const [website, setWebsite] = useState('');
  const [show, setShow] = useState(true);
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [image1, setImage1] = useState('');
  const [image2, setImage2] = useState('');
  const [link, setLink] = useState('');
  const [status, setStatus] = useState(1);


  var html = '<h1>Hello, world!</h1>'

  useEffect(() => {
    Api.getHeadlines()
      .then(result => {
        setHeadlines(result.data.headline)
      });
    Api.getWebsite().then(result => {
      setWebsite(result.data.html.website)
    })
  }, []);

  function handleClick (e) {
    e.preventDefault();
    let path = []
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
      path.push([parentNode.nodeName, n, parentNode.getAttribute('class')])
      currentNode = parentNode;
      parentNode = currentNode.parentNode;
      children = parentNode.children;
    }
    console.log(path)
    switch (status) {
      case 1: setTitle(e.target.text)
      case 2: setSummary(e.target.innerText)
      case 3: setImage1(e.target.src)
      case 4: setImage2(e.target.getAttribute('data-src'))
      case 5: setLink(e.target.href)

    }
    console.log('link', e.target.this);
    console.log('image', e.target.src);
    console.log('image', e.target.getAttribute('data-src'));
    // console.log('text', e.target.innerText);
  }
  function changeStatus () {
    if (status <= 5) {
      setStatus(status + 1)
      console.log(status)
    }
  }
  function toggleShow () {
    setShow(!show)
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
                    <p>{image1}</p>
                  </div>;
                  case 4: return <div>
                    <p>Select a Image</p>
                    <p>{image2}</p>
                  </div>;
                  case 5: return <div>
                    <p>Select a Link</p>
                    <p>{link}</p>
                  </div>;
                }
              })()}
              <button onClick={changeStatus} >Next</button>
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
