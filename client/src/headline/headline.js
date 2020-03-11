import React from 'react';
import './headline.css';
import Api from '../api-client'

export default ({ headline, deleteHeadline, deleteScraper }) => {

  const deleteItem = () => {
    if(deleteHeadline) Api.deleteHeadline(headline.id)
    if(deleteScraper) Api.deleteScraper(headline.scraperID)
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }

  return (
    <div className="outer-post-box">
      <p className="newspaper-header"> {headline.newspaper}</p>
      {(deleteScraper || deleteHeadline) &&
        <button onClick={deleteItem}> DELETE </button>
      }
      <a href={headline.link} style={{ display: "block" }}>LINK</a>
      <div className="newspaper">
      </div>
      <div className="inner-post-box">
        {headline.image &&
          <img className="image" src={headline.image} alt="image" />
        }
        <p className="title">{headline.headline}</p>
        {headline.summary &&
          <p className="summary">{headline.summary}</p>
        }
      </div>
    </div>
  )
}

