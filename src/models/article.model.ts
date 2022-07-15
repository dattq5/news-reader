export interface ArticleSourceModel {
  id: string;
  name: string;
}
export interface ArticleModel {
  author: string;
  title: string;
  description: string;
  url: string;
  image: string;
  source: string;
  publishedAt: string;
}
