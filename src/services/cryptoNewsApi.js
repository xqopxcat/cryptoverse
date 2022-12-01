import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl = 'https://bing-news-search1.p.rapidapi.com';

export const cryptoNewsApi = createApi({
    reducerPath: 'cryptoNewsApi',
    baseQuery: fetchBaseQuery({
        baseUrl,
        prepareHeaders: (headers) => {
            headers.set('X-BingApis-SDK', 'true',);
            headers.set('X-RapidAPI-Key', 'b5d80e39b6msh3641ea751d75c84p1d3ad0jsn6efd83513465');
            headers.set('X-RapidAPI-Host', 'bing-news-search1.p.rapidapi.com');
            return headers;
        },
    }),
    endpoints: (builder) => ({
        getCryptoNews: builder.query({
            query: ({ newsCategory, count }) => 
                `/news/search?q=${newsCategory}&freshness=Day&textFormat=Raw&safeSearch=Off&count=${count}`
        })
    })
});

export const {
    useGetCryptoNewsQuery
} = cryptoNewsApi;


