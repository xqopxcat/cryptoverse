import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';


const baseUrl = 'https://coinranking1.p.rapidapi.com';

export const cryptoApi = createApi({
    reducerPath: 'cryptoApi',
    baseQuery: fetchBaseQuery({
        baseUrl,
        prepareHeaders: (headers) => {
            headers.set('X-RapidAPI-Key', 'b5d80e39b6msh3641ea751d75c84p1d3ad0jsn6efd83513465');
            headers.set('X-RapidAPI-Host', 'coinranking1.p.rapidapi.com');
            return headers;
        },
    }),
    endpoints: (builder) => ({
        getCryptos: builder.query({
            query: (count) => `/coins?limit=${count}`
        }),
        getCryptoDetails: builder.query({
            query: ({ coinId, timePeriod }) => `/coin/${coinId}?timePeriod=${timePeriod}`
        }),
        getCryptoHistory: builder.query({
            query: ({ coinId, timePeriod }) => ({
                url: `/coin/${coinId}/history`,
                params: { timePeriod }
            }),
        }),
        getCryptoExchanges: builder.query({
            query: ({ coinId, queryPayload }) => {
                return ({
                    url: `/coin/${coinId}/exchanges`,
                    params: queryPayload
                });
            }
        })
    })
});

export const {
    useGetCryptosQuery,
    useGetCryptoDetailsQuery,
    useGetCryptoHistoryQuery,
    useGetCryptoExchangesQuery,
    useLazyGetCryptoExchangesQuery
} = cryptoApi;


