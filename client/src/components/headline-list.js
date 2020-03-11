import React, { useState } from 'react';
import Headline from './headline'
import { CircularProgress } from '@material-ui/core';

export default ({ headlines }) => {
  return (
    <div className="list__container">
      {headlines.length === 0 &&
        <div className="no-content-container">
          <CircularProgress />
        </div>}

      {headlines.length > 0 &&

        headlines.map(headline => {
          return <Headline
            key={headline.id}
            headline={headline}
          />
        })

      }
    </div>
  )
}

