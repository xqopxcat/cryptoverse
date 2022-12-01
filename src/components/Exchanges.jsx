import React, { useEffect, useState } from 'react';
import { Table, Col, Select, Row, Typography } from 'antd';
import { 
    useLazyGetCryptoExchangesQuery, 
    useGetCryptosQuery
} from '../services/cryptoApi';
import { Loader } from '../components';
import millify from 'millify';

const { Text } = Typography;
const { Option } = Select;

const Exchanges = () => {
    const [queryPayload, setQueryPayload] = useState({
        limit: 100,
    });
    const { data: cryptosList } = useGetCryptosQuery(100);
    const [getCryptoExchanges, { data, isFetching }] = useLazyGetCryptoExchangesQuery();
    
    const [coinId, setCoinid] = useState();
    useEffect(() => {
        if (cryptosList) {
            setCoinid(cryptosList?.data?.coins[0].uuid);
        }
    }, [cryptosList]);
    
    useEffect(() => {
        if (coinId) {
            getCryptoExchanges({ coinId, queryPayload });
        }
    }, [coinId, queryPayload, getCryptoExchanges]);
    
    const columns = [
        {
            title: 'Exchanges',
            dataIndex: 'exchanges',
            render: (item) => {
                return (
                    <Row align="middle">
                        <Text>{ `${item.rank}. ` }</Text>
                        <img 
                            src={ item.iconUrl } 
                            alt="icon" 
                            style={ { maxWidth: '24px', maxHeight: '24px', margin: '0 4px' } } 
                        />
                        <Text>{ `${item.name}` }</Text>
                    </Row>
                );
            }
        },
        {
            title: '24h Trade Volume',
            dataIndex: '24hVolume',
            sorter: true
        },
        {
            title: 'Markets',
            dataIndex: 'numberOfMarkets',
            sorter: true
        },
        {
            title: 'Price',
            dataIndex: 'price',
            sorter: true
        }
    ];
    
    if (isFetching) {
        return <Loader />;
    }
    
    const globalData = data?.data?.exchanges;
    const exchangesData = globalData?.map((item) => {
        return ({
            key: item.uuid,
            exchanges: item,
            '24hVolume': millify(item['24hVolume']),
            numberOfMarkets: millify(item.numberOfMarkets),
            price: millify(item.price)
        });
    });
    
    const onChange = (pagination, filters, sorter, extra) => {
        const { field, order } = sorter;
        setQueryPayload({
            ...queryPayload,
            orderBy: field,
            orderDirection: order?.replace('end', '')
        });
    };
    
    return (
        <>
            <Row gutter={ [12, 12] }>
                <Col span={ 24 }>
                    <Select
                        showSearch
                        defaultValue={ coinId }
                        className="select-news"
                        placeholder="Select a Crypto"
                        optionFilterProp="children"
                        onChange={ (value) => setCoinid(value) }
                        filterOption={ (input, option) => (option?.key ?? '')
                            .toLowerCase()
                            .includes(input.toLowerCase())
                        }
                    >
                        {
                            cryptosList?.data?.coins.map(({ uuid, name }) => (
                                <Option value={ uuid } key={ name }>{ name }</Option>
                            ))
                        }
                    </Select>
                </Col>
                <Col span={ 24 }>
                    <Table
                        columns={ columns } 
                        dataSource={ exchangesData } 
                        onChange={ onChange }
                        pagination={ {
                            pageSize: 20
                        } }
                        scroll={{
                            y: window.innerHeight,
                        }}
                    />
                </Col>
            </Row>
        </>
    );
};

export default Exchanges;