import React, { useState } from 'react';
import HTMLReactParser from 'html-react-parser';
import { useParams } from 'react-router-dom';
import millify from 'millify';
import { Col, Row, Typography, Select } from 'antd';
import { 
    MoneyCollectOutlined, 
    DollarCircleOutlined,
    FundOutlined,
    ExclamationCircleOutlined, 
    StopOutlined, TrophyOutlined, 
    CheckOutlined,
    NumberOutlined, 
    ThunderboltOutlined
} from '@ant-design/icons';

import { useGetCryptoDetailsQuery, useGetCryptoHistoryQuery } from '../services/cryptoApi';
import LineChart from './LineChart';
import Loader from './Loader';

const { Title, Text } = Typography;
const { Option } = Select;

const defaultCryptoDetail = {
    name: '',
    description: '',
    links: [],
    price: 0,
    rank: 0,
    marketCap: 0,
    allTimeHigh: 0,
    numberOfMarkets: 0,
    numberOfExchanges: 0,
    supply: undefined,
};

const CryptoDetails = () => {
    const { coinId } = useParams();
    const [timePeriod, setTimePeriod] = useState('7d');
    
    const { data, isFetching } = useGetCryptoDetailsQuery({ coinId, timePeriod });
    const { data: coinHistory } = useGetCryptoHistoryQuery({ coinId, timePeriod });
    const cryptoDetails = data?.data?.coin;
    const { 
        name,
        description,
        links,
        price,
        rank, 
        marketCap, 
        allTimeHigh,
        numberOfMarkets,
        numberOfExchanges,
        supply,
    } = cryptoDetails ?? defaultCryptoDetail;
    
    if (isFetching) { 
        return <Loader />;
    };
    
    const time = ['3h', '24h', '7d', '30d', '3m', '1y', '3y', '5y'];

    const stats = [
        {
            title: 'Price to USD',
            value: `$ ${price && millify(price)}`,
            icon: <DollarCircleOutlined />
        },
        {
            title: 'Rank',
            value: rank,
            icon: <NumberOutlined />
        },
        {
            title: '24h Volume',
            value: `$ ${cryptoDetails['24hVolume'] && millify(cryptoDetails['24hVolume'])}`,
            icon: <ThunderboltOutlined />
        },
        {
            title: 'Market Cap',
            value: `$ ${marketCap && millify(marketCap)}`,
            icon: <DollarCircleOutlined />
        },
        {
            title: 'All-time-high(daily avg.)',
            value: `$ ${allTimeHigh?.price && millify(allTimeHigh?.price)}`,
            icon: <TrophyOutlined />
        },
    ];
  
    const genericStats = [
        {
            title: 'Number Of Markets',
            value: numberOfMarkets,
            icon: <FundOutlined />
        },
        {
            title: 'Number Of Exchanges',
            value: numberOfExchanges,
            icon: <MoneyCollectOutlined />
        },
        {
            title: 'Aprroved Supply',
            value: supply?.confirmed ? <CheckOutlined /> : <StopOutlined />,
            icon: <ExclamationCircleOutlined />
        },
        {
            title: 'Total Supply',
            value: `$ ${supply?.total && millify(supply?.total)}`,
            icon: <ExclamationCircleOutlined />
        },
        {
            title: 'Circulating Supply',
            value: `$ ${supply?.circulating && millify(supply?.circulating)}`,
            icon: <ExclamationCircleOutlined />
        },
    ];
    
    return (
        <Col className="coin-detail-container">
            <Col className="coin-heading-container">
                <Title level={ 2 } className="coin-name">
                    { `${ name } Price` }
                </Title>
                <p>
                    { `${ name } live price in US dollars. View value statistics, market cap and supply.` }
                </p>
            </Col>
            <Select 
                defaultValue={ timePeriod } 
                className="select-timeperiod" 
                placeholder="Select Time Period"
                onChange={ (value) => setTimePeriod(value) }
            >
                {
                    time.map((date) => (
                        <Option value={ date } key={ date }>{ date }</Option>
                    ))
                }
            </Select>
            <LineChart coinHistory={ coinHistory } currentPrice={ millify(price) } coinName={ name } />
            <Col className="stats-container">
                <Col className="coin-value-statistics">
                    <Col className="coin-value-statistics-heading">
                        <Title level={ 3 } className="coin-details-heading">
                            { `${name} Value Statistics` }
                        </Title>
                        <p>
                            { `An overview showing the stats of ${ name }` }
                        </p>
                    </Col>
                    {
                        stats.map(({ icon, title, value }) => (
                            <Col className="coin-stats" key={ title }>
                                <Col className="coin-stats-name">
                                    <Text>{ icon }</Text>
                                    <Text>{ title }</Text>
                                </Col>
                                <Text className="stats">{ value }</Text>
                            </Col>
                        ))
                    }
                </Col>
                <Col className="other-stats-info">
                    <Col className="coin-value-statistics-heading">
                        <Title level={ 3 } className="coin-details-heading">
                            Other Stats Info
                        </Title>
                        <p>
                            An overview showing the all cryptocurrencies
                        </p>
                    </Col>
                    {
                        genericStats.map(({ icon, title, value }) => (
                            <Col className="coin-stats" key={ title }>
                                <Col className="coin-stats-name">
                                    <Text>{ icon }</Text>
                                    <Text>{ title }</Text>
                                </Col>
                                <Text className="stats">{ value }</Text>
                            </Col>
                        ))
                    }
                </Col>
            </Col>
            <Col className="coin-desc-link">
                <Row className="coin-desc">
                    <Title level={ 3 } className="coin-details-heading">
                        { `What is ${ name }` }
                    </Title>
                    <div className="coin-details-description">
                        { HTMLReactParser(description) }
                    </div>
                </Row>
                <Col className="coin-links">
                    <Title level={ 3 } className="coin-details-heading">
                        { `${ name } Links` }
                    </Title>
                    { links.map(({ name, type, url }) => {
                        return (
                            <Row className="coin-link" key={ name }>
                                <Title level={ 5 } className="link-name">
                                    { type }
                                </Title>
                                <a href={ url } target="_blank" rel="noreferrer">
                                    { name }
                                </a>
                            </Row>  
                        );
                    }) }
                </Col>
            </Col>
        </Col>
    );
};

export default CryptoDetails;