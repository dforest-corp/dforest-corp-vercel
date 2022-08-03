type Reference<T, R> = T extends 'get' ? R : string | null;
interface GetsType<T> {
  contents: T[];
  totalCount: number;
  offset: number;
  limit: number;
}
type DateType = {
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
};
type Structure<T, P> = T extends 'get'
  ? { id: string } & DateType & Required<P>
  : T extends 'gets'
  ? GetsType<{ id: string } & DateType & Required<P>>
  : Partial<DateType> & (T extends 'patch' ? Partial<P> : P);

export type news<T='get'> = Structure<
T,
{
  /**
   * タイトル
   */
  title?: string
  /**
   * 内容
   */
  content?: string
  /**
   * カテゴリ
   */
  category?: Reference<T,unknown | null>
}>

export type categories<T='get'> = Structure<
T,
{
  /**
   * カテゴリ名
   */
  name?: string
}>


export interface EndPoints {
  get: {
    news: news<'get'>
    categories: categories<'get'>
  }
  gets: {
    news: news<'gets'>
    categories: categories<'gets'>
  }
  post: {
    news: news<'post'>
    categories: categories<'post'>
  }
  put: {
    news: news<'put'>
    categories: categories<'put'>
  }
  patch: {
    news: news<'patch'>
    categories: categories<'patch'>
  }
}

export interface WebhookContentBody {
  id: string
  createdAt: string
  updatedAt: string
  publishedAt: string
  revisedAt: string
  title: string
}

export interface WebhookContent {
  id: string
  status: ('PUBLISH' | 'DRAFT')[]
  draftKey: string | null
  publishValue: WebhookContentBody | null
  draftValue: WebhookContentBody | null
}

export interface Webhook {
  service: string
  api: string
  id: string | null
  type: 'new' | 'edit' | 'delete'
  contents: {
    old: WebhookContent | null
    new: WebhookContent | null
  }
}