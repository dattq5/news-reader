import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import { API } from '../common/api';
import { STORAGE_KEY } from '../common/constants';
import { ArticleModel, ArticleSourceModel } from '../models/article.model';
import ArticleCard from '../components/ArticleCard';
import defaultArticleImage from '../assets/placeholder-news.jpg';

export default function ArticleList() {
  const [sourceList, setSourceList] = useState<ArticleSourceModel[]>([]);
  const [articleList, setArticleList] = useState<ArticleModel[]>([]);
  const [source, setSource] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const sourceStr = localStorage.getItem(STORAGE_KEY.SOURCES);
    if (!sourceStr) {
      // setIsLoading(true);
      fetch(API.getSources())
        .then(response => response.json())
        .then(data => {
          console.log(data);
          if (data.status === 'ok') {
            const sources: ArticleSourceModel[] = (data.sources || []).map((source: any) => ({
              id: source.id,
              name: source.name
            }));
            setSourceList(sources);
            localStorage.setItem(STORAGE_KEY.SOURCES, JSON.stringify(sources));
          }
        }).catch(e => {
          console.error('Error while fetching sources', e);
        }).finally(() => {
          // setIsLoading(false);
        });
    } else {
      setSourceList(JSON.parse(sourceStr));
    }
  }, []);
  
  useEffect(() => {
    const sourceId = sourceList.find(s => s.name === source)?.id;
    // setIsLoading(true);
    fetch(API.getArticles({source: sourceId}))
        .then(response => response.json())
        .then(data => {
          console.log(data);
          if (data.status === 'ok') {
            setArticleList((data.articles || []).map((article: any) => ({
              author: article.author,
              title: article.title,
              description: article.description,
              url: article.url,
              image: article.urlToImage || defaultArticleImage,
              source: article.source?.name ?? '',
              publishedAt: article.publishedAt
            })));
          }
        }).catch(e => {
          console.error('Error while fetching article list', e);
        }).finally(() => {
          // setIsLoading(false);
        });
  }, [source]);
  return <>
    {
      isLoading ?
      <Box sx={{ display: 'flex', width: '100vw', height: '100vh', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
      </Box>
      :
      <Grid container spacing={2}>
        <Grid item xs={8}>
        </Grid>
        <Grid item xs={4}>
          <Autocomplete
            disablePortal
            id="combobox-articleSources"
            inputValue={source}
            onInputChange={(event, newInputValue) => {
              setSource(newInputValue);
            }}
            options={sourceList}
            getOptionLabel={option => option?.name ?? ''}
            sx={{ width: 300 }}
            renderInput={(params) => <TextField {...params} label="Source..." />}
          />
        </Grid>
        {
          articleList.map((article, idx) => <Grid item xs={6} md={4} lg={3} key={idx}>
              <ArticleCard  image={article.image}
                            title={article.title}
                            url={article.url}
                            author={article.author}
                            description={article.description}
                            source={article.source}
                            publishedAt={article.publishedAt} />
            </Grid>)
        }
      </Grid>
    }
  </>;  
}