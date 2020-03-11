import React, { useState } from 'react';
import Headline from './headline'

export default ({ headlines }) => {
  return (
    <div className="list__container">
      {headlines.length === 0 &&
        <div className="no-content-container">
          <span className="no-content">No Headlines Yet!</span>
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

