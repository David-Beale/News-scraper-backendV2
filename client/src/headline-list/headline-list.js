import React, { useState } from 'react';
import Headline from '../headline/headline'
import { CircularProgress } from '@material-ui/core';

export default ({ headlines, deleteHeadline, deleteScraper }) => {
  return (
    <div className="list__container">
      {headlines.length === 0 &&
        <div className="no-content-container">
          <CircularProgress />
        </div>}

      {headlines.length > 0 &&
        <div id="" className="">

          {headlines.map((headline) => {
            return <Headline
              key={headline.id}
              headline={headline}
              deleteHeadline={deleteHeadline}
              deleteScraper={deleteScraper}
            />
          })}
        </div>}
    </div>
  )
}

