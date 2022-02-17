//네비게이션 바로 웹 페이지 상단부의 페이지 이동 메뉴 부분
import React, { useState } from 'react'
import { Drawer, Button } from 'antd';
import { AlignRightOutlined } from '@ant-design/icons'
import RightMenu from './sections/RightMenu';
import LeftMenu from './sections/LeftMenu'
import './sections/Navbar.css'

function NavBar() {
    const [visible, setVisible] = useState(false)

    const showDrawer = () => {
        setVisible(true)
    };

    const onClose = () => {
        setVisible(false)
    };


    return (
        <nav className='menu' style={{ position: 'fixed', zIndex: 5, width: '100%'}}>
            <div className="menu__logo">
                <a href="/">Logo</a>
            </div>
            <div className="menu__container">
                <div className="menu_left">
                    <LeftMenu mode="horizontal" />
                </div>
                <div className="menu_right">
                    <RightMenu mode="horizontal" />
                </div>
                <Button className="menu__mobile-button" type="primary" onClick={showDrawer}>
                    <AlignRightOutlined/>
                </Button>
                <Drawer title="Basic Drawer" placement="right" className="menu_drawer" closable={false} onClose={onClose} visible={visible}>
                        <LeftMenu mode="inline" />
                        <RightMenu mode="inline" />
                </Drawer>
            </div>
        </nav>
    )
}

export default NavBar
