import 'isomorphic-fetch'
import { camelizeKeys } from 'humps'

const API_KEY = process.env.REACT_APP_GIPHY_API_KEY

const END_POINT = {
  SEARCH: '//api.giphy.com/v1/gifs/search',
}

export const search = async(keyword: string): Promise<GiphySearchResult> => {
  const res = await fetch(`${END_POINT.SEARCH}?api_key=${API_KEY}&q=${keyword}&limit=10`)
  return (camelizeKeys(await res.json()) as GiphySearchResult)
}
