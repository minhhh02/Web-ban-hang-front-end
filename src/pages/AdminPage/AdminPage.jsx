import { Menu } from 'antd'
import React, { useState } from 'react'
import { getItem } from '../../util';
import { UserOutlined, AppstoreOutlined } from '@ant-design/icons'
import HeaderComponent from '../../components/HeaderComponent/HeaderComponent';
import AdminProduct from '../../components/AdminProduct/AdminProduct';
import AdminUser from '../../components/AdminUser/AdminUser';

const AdminPage = () => {
  const items = [
    getItem('Quản lý người dùng', 'user', <UserOutlined />),
    getItem('Quản lý sản phẩm', 'product', <AppstoreOutlined />)
  ];

  const [KeySelected, setKeySelected] = useState('')

  const renderPage = (key) => {
    switch(key) {
      case 'user':
        return (
          <AdminUser />
        )
      case 'product':
        return (
          <AdminProduct />
        )
      default:
        return <></>
    }
  }

  const handleOnClick = ({key}) => {
    setKeySelected(key)
  }

  return (
    <>
      <HeaderComponent isHiddenSearch isHiddenCart />
      <div style={{ display: 'flex' }}>
        <Menu
          mode="inline"
          style={{
            width: 256,
            boxShadow: '1px 1px 2px #ccc',
            height: '125vh'
          }}
          items={items}
          onClick={handleOnClick}
        />
        <div style={{ flex: 1, padding: '15px' }}>
          {renderPage(KeySelected)}
        </div>
      </div>
    </>
  )
}

export default AdminPage