import React from 'react';
import { Card, CardActionArea, CardContent, CardMedia, Typography } from '@mui/material';
import './ClothCard.css';

function ClothCard({ name, price, image, link }) {
  return (
    <Card className="cloth-card">
      <CardActionArea href={link} target="_blank">
        <CardMedia
          component="img"
          alt={name}
          height="140"
          image={image}
          title={name}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {name}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {price}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default ClothCard;
