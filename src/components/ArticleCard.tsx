import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import { ArticleModel } from '../models/article.model';

export default function ArticleCard({image, title, author, description, publishedAt, source, url}: ArticleModel) {
  return (
    <Card sx={{ maxWidth: 300, minHeight: 550 }}>
      <CardMedia
        component="img"
        height="140"
        image={image}
        alt={title}
        title={title}
        onClick={() => window.open(url, '_blank')}
        sx={{ cursor: 'pointer'}}
      />
      <CardContent>
        <Grid container>
          <Grid item xs={12} md={8}>
            <Typography variant="subtitle2" component="div" sx={{color: 'gray'}} title={author}>
              {author}
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle2" component="div" sx={{color: 'gray'}}>
              {(new Date(publishedAt)).toLocaleDateString()}
            </Typography>
          </Grid>
        </Grid>
        <Typography gutterBottom variant="h5" component="div">
        <Link href={url} underline="hover" variant="h5" target="_blank" title={title}>
          {title}
        </Link>
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
}