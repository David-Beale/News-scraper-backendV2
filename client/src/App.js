import React, { useState, useEffect } from 'react';
import './App.css';
import HeadlineList from './headline-list/headline-list';
import Api from './api-client';

function App () {

  const [headlines, setHeadlines] = useState([]);

  var html = '<h1>Hello, world!</h1>'

  useEffect(() => {
    Api.getHeadlines()
      .then(result => {
        setHeadlines(result.data.headline)
      });
  }, []);

  return (
    <div>
      <div className="app-container">
        <div className="main-header">
          <h1 className="header">Headlines</h1>
        </div>
        <HeadlineList
          headlines={headlines}
        />
        <div dangerouslySetInnerHTML={{__html: html}} />
      </div>
    </div>
  );
}

export default App;
