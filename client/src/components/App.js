import React, { useState, useEffect } from 'react';
import DatePicker from 'react-date-picker'
import { Button } from '@material-ui/core';


import HeadlineList from './headline-list';
import AddFeed from './AddFeed';

import Api from '../api-client';

import logoPath from '../assets/icon.png';


let date = new Date().getDate();
let month = new Date().getMonth() + 1;
let year = new Date().getFullYear();




function App() {
  const [headlines, setHeadlines] = useState([]);
  const [locale, setLocale] = useState("UK");
  const [dateFull, setDate] = useState(new Date());
  const [addFeed, setAddFeed] = useState(false);
  console.log(locale)

  const changeLocale = () => {
    const localeInstance = locale === "UK" ? "ES" : "UK";
    setLocale(() => (localeInstance))
    Api.getHeadlines(date, month, year, locale)
      .then(data => setHeadlines(data.data.headline))
      .catch((error) => {
        console.log("Api call error");
        alert(error.message);
      });
  }
  const onChange = (selectedDate) => {
    const currentDate = selectedDate || dateFull;
    if (selectedDate) {
      year = selectedDate.getFullYear();
      month = selectedDate.getMonth() + 1;
      date = selectedDate.getDate();
      console.log(year, month, date)
    }
    Api.getHeadlines(date, month, year, locale)
      .then(data => setHeadlines(data.data.headline))
      .catch((error) => {
        console.log("Api call error");
        alert(error.message);
      });
    setDate(currentDate);
  };
  useEffect(() => {
    Api.getHeadlines(date, month, year, locale)
      .then(result => {
        setHeadlines(result.data.headline)
      });
  }, []);

  return (
    <div className='app__container'>
      <nav className="appbar bar">
        <div
          onClick={e => { e.preventDefault(); setAddFeed(false) }}
          className="logo__container"
        >
          <img
            className="logo"
            src={logoPath}
          />
        </div>
        <div className="action__container">
          <Button
            variant="contained"
            className="form-toggle"
            onClick={e => { e.preventDefault(); setAddFeed(true); }}
          >
            Add Feed
          </Button>
          <Button
            variant="contained"
            className="locale-button"
            value={locale}
            onClick={e => {
              e.preventDefault(); changeLocale()
            }}
          >{locale}</Button>
          <Button>
            <DatePicker
              clearIcon={null}
              calendarIcon={null}
              className="date-picker"
              value={dateFull}
              maxDate={new Date()}
              onChange={(date) => onChange(date)} />
          </Button>
        </div>

      </nav>
      {
        addFeed ? <AddFeed setAddFeed={setAddFeed} className="add-feed__container" /> : <HeadlineList headlines={headlines} />
      }
      <div className="footer__container bar">
        <p className="footer__text">
          <i>developed by:</i> David B. & Joseph T.C.
        </p>
      </div>
    </div>
  );
}

export default App;
