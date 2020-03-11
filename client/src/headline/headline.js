import React from 'react';
import Api from '../api-client'
import { Card, CardMedia, CardContent, Typography, CardActions, Button } from '@material-ui/core'

export default ({ headline, deleteHeadline, deleteScraper }) => {

  const deleteItem = (e) => {
    e.preventDefault();
    if (deleteHeadline) Api.deleteHeadline(headline.id)
    if (deleteScraper) Api.deleteScraper(headline.scraperID)
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }

  return (
    < a
      className="anchor-link"
      href={headline.link} >
      <Card className={'card__container'} raised={true}>
        {(deleteScraper || deleteHeadline) &&
          <button onClick={deleteItem}> DELETE </button>
        }
        <CardMedia
          className="card__image"
          image={`${headline.image}`}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {headline.newspaper}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {headline.headline}
          </Typography>
          {/* <Typography variant="body2" color="textSecondary" component="p">
            {headline.summary}
          </Typography> */}
        </CardContent>
      </Card>
    </a >
  )
}

