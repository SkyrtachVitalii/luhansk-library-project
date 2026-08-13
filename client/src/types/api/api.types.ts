import { IPost } from './post.types';

export interface PostsResponse {
  data: IPost[];
  currentPage: number;
  numberOfPages: number;
  totalPosts: number;
}

export interface PostsArgs {
  page?: number;
  limit?: number;
  category?: string;
  lang?: string;
  oldId?: number;
}
