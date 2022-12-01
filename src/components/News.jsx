/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { Select, Typography, Row, Col, Avatar, Card } from 'antd';
import moment from 'moment';
import { useGetCryptoNewsQuery } from '../services/cryptoNewsApi';
import { useGetCryptosQuery } from '../services/cryptoApi';
import { Loader } from '../components';


const { Title, Text } = Typography; 
const { Option } = Select; 



const demoImage = 'https://coinrevolution.com/wp-content/uploads/2020/06/cryptonews.jpg';

const News = ({ simplified }) => {
    const count = simplified ? 6 : 12;
    const [newsCategory, setNewsCategory] = useState('Cryptocurrency');
    const { data: cryptoNews } = useGetCryptoNewsQuery({ newsCategory, count });
    const { data } = useGetCryptosQuery(100);
    // const coinsList = data?.data?.coins.map(({ name }) => ({ value: name, label: name })) ?? [];
    // const cryptoOptions = [...[{ value: 'Cryptocurrency', label: 'Cryptocurrency' }], ...coinsList];
    if (!cryptoNews?.value) {
        return <Loader />;
    };
    
    return (
        <Row gutter={ [ 24, 24] }>
            { 
                simplified ?? (
                    <Col span={ 24 }>
                        <Select
                            showSearch
                            className="select-news"
                            placeholder="Select a Crypto"
                            optionFilterProp="children"
                            onChange={ (value) => setNewsCategory(value) }
                            filterOption={ (input, option) => (option?.label ?? '')
                                .toLowerCase()
                                .includes(input.toLowerCase())
                            }
                        >
                            <Option value="Cryptocurrency">Cryptocurrency</Option>
                            {
                                data?.data?.coins.map(({ name }) => (
                                    <Option value={ name } key={ name }>{ name }</Option>
                                ))
                            }
                        </Select>
                    </Col>
                )
            }
            {
                cryptoNews.value.map(({ url, name, image, description, provider, datePublished }, i) => {
                    return (
                        <Col xs={ 24 } sm={ 12 } lg={ 8 } key={ name }>
                            <Card hoverable className="news-card">
                                <a href={ url } target="_blank" rel="noreferrer">
                                    <div className="news-image-container">
                                        <Title className="news-title" level={ 4 }>
                                            { name }
                                        </Title>
                                        <img 
                                            src={ image?.thumbnail?.contentUrl || demoImage } 
                                            alt="news" 
                                            style={ { maxWidth: '200px', maxHeight: '200px' } }
                                        />
                                    </div> 
                                    <p>
                                        { description > 100 ? `${description.substring(0, 100)}...` : description }
                                    </p>
                                    <div className="provider-container">
                                        <div>
                                            <Avatar 
                                                src={ provider[0]?.image?.thumbnail?.contentUrl || demoImage } 
                                                alt="news" 
                                            />
                                            <Text className="provider-name">{ provider[0]?.name }</Text>
                                        </div>
                                        <Text>{ moment(datePublished).startOf('ss').fromNow() }</Text>
                                    </div>
                                </a>
                            </Card>
                        </Col>
                    );
                })
            }
        </Row>
    );
};

export default News;