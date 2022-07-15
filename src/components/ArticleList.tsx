import React, { useCallback, useEffect, useRef, useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import { API } from '../common/api';
import { DEFAULT_PAGE_SIZE, STORAGE_KEY } from '../common/constants';
import { ArticleModel, ArticleSourceModel } from '../models/article.model';
import ArticleCard from './ArticleCard';
import defaultArticleImage from '../assets/placeholder-news.jpg';

export default function ArticleList() {
  const [sourceList, setSourceList] = useState<ArticleSourceModel[]>([]);
  const [articleList, setArticleList] = useState<ArticleModel[]>([]);
  const [source, setSource] = useState('');
  const totalItemsRef = useRef(-1);
  const [currentPage, setCurrentPage] = useState(1);
  
  // load content function
  const loadArticles = useCallback((page: number = 1) => {
    const sourceId = sourceList.find(s => s.name === source)?.id;
    setCurrentPage(page);
    fetch(API.getArticles({page, source: sourceId}))
        .then(response => response.json())
        .then(data => {
          console.log(data);
          if (data.status === 'ok') {
            if (page === 1) {
              totalItemsRef.current = data.totalResults;
            }
            const newArticleList: ArticleModel[] = (data.articles || []).map((article: any) => ({
              author: article.author,
              title: article.title,
              description: article.description,
              url: article.url,
              image: article.urlToImage || defaultArticleImage,
              source: article.source?.name ?? '',
              publishedAt: article.publishedAt
            }))
            setArticleList(page === 1 ? newArticleList : articleList.concat(newArticleList));
          }
        }).catch(e => {
          console.error('Error while fetching article list', e);
        });
  }, [source, currentPage]);

  useEffect(() => {
    // fetch source
    const sourceStr = localStorage.getItem(STORAGE_KEY.SOURCES);
    if (!sourceStr) {
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
        });
    } else {
      setSourceList(JSON.parse(sourceStr));
    }
    const loadMore = () => {
      if (totalItemsRef.current <= (DEFAULT_PAGE_SIZE * currentPage)) {
        return;
      }
      if (window.innerHeight + document.documentElement.scrollTop === document?.scrollingElement?.scrollHeight) {
        setCurrentPage(currentPage + 1);
      }
    }
    
    // add scroll event listen for load more function
    document.addEventListener('scroll', loadMore);
  
    return () => {
      document.removeEventListener('scroll', loadMore);
    }
  }, []);
  
  useEffect(() => {
    // load content when source has been changed
    loadArticles();
  }, [source]);
  
  useEffect(() => {
    // load more content
    if (currentPage > 1) {
      loadArticles(currentPage);
    }
  }, [currentPage]);
  return <>
    {
      articleList.length === 0 ?
      <Box sx={{ display: 'flex', width: '100vw', height: '100vh', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
      </Box>
      :
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Box sx={{display: 'flex', flexDirection: 'row-reverse'}}>
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
          </Box>
        </Grid>
        {
          articleList.map((article, idx) => <Grid item xs={12} sm={6} md={4} lg={3} key={idx}>
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