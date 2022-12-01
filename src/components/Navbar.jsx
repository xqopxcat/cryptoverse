import React, { useState, useEffect } from 'react';
import { Button, Menu, Typography, Avatar } from 'antd';
import { Link } from 'react-router-dom';
import { 
    HomeOutlined, 
    MoneyCollectOutlined,
    BulbOutlined,
    FundOutlined,
    MenuOutlined
} from '@ant-design/icons';
 
import icon from '../images/cryptocurrency.png';

const menuItems = [
    {
        key: 'home',
        label: (<Link to="/">Home</Link>),
        icon: <HomeOutlined />
    },
    {
        key: 'cryptocurrencies',
        label: (<Link to="/cryptocurrencies">Cryptocurrencies</Link>),
        icon: <FundOutlined />
    },
    {
        key: 'exchanges',
        label: (<Link to="/exchanges">Exchanges</Link>),
        icon: <MoneyCollectOutlined />
    },
    {
        key: 'news',
        label: (<Link to="/news">News</Link>),
        icon: <BulbOutlined />
    },
];

const { Title } = Typography;

const Navbar = () => {
    const [activeMenu, setActiveMenu] = useState(true);
    const [screenSize, setScreenSize] = useState(null);
    
    useEffect(() => {
        const handleResize = () => setScreenSize(window.innerWidth);
        
        window.addEventListener('resize', handleResize);
        
        handleResize();
        return () =>  window.removeEventListener('resize', handleResize);
    }, []);
    
    useEffect(() => {
        if (screenSize < 768) {
            setActiveMenu(false);
        }
        else {
            setActiveMenu(true);
        }
    }, [screenSize]);
    
    return (
        <div className="nav-container">
            <div className="logo-container">
                <Avatar src={ icon } size="large" />
                <Title level={ 2 } className="logo">
                    <Link to="/">
                        Cryptoverse
                    </Link>
                </Title>
                <Button 
                    className="menu-control-container" 
                    onClick={ () => setActiveMenu(!activeMenu) }
                >
                    <MenuOutlined />
                </Button>
            </div>
            { activeMenu && (
                <Menu 
                    theme="dark"
                    items={ menuItems }
                />
            ) }
            
        </div>
    );
};

export default Navbar;