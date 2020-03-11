import React from 'react';
import './headline.css';

export default ({ headline }) => {

  return (
    <div className="outer-post-box">
      <a href={headline.link} style={{display: "block"}}>LINK</a>
      <div className="newspaper">
        <p className="newspaper-header"> {headline.newspaper}</p>
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

