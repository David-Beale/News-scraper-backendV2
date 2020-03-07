import React from 'react';
import './headline.css';
import * as moment from 'moment';

export default ({ headline }) => {

  return (
    <div className="outer-post-box">
      <div className="newspaper">
        <p className="newspaper-header"> {headline.newspaper}</p>
        {/* <p className="date-header"> {moment(event.date).format('MMM')}</p> */}
      </div>
      <div className="inner-post-box">
        <p className="title">{headline.headline}</p>
        {/* <p className="date">{moment(event.date).format('h:mm a - MMMM Do, YYYY' )}</p> */}
        {/* <p className="venue">{event.venue}</p> */}
      </div>
    </div>
  )
}

