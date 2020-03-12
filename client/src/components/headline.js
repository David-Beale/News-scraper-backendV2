import React from 'react';

import { Card, CardMedia, CardContent, Typography, CardActions, Button } from '@material-ui/core'


export default ({ headline }) => {
  console.log(headline)
  return (
    <a
      className="anchor-link"
      href={headline.website}>
      <Card className={'card__container'} raised={true}>
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
        </CardContent>
      </Card>
    </a>
  )
}

