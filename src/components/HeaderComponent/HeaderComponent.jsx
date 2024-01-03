import { Badge, Button, Col, Popover, Row } from 'antd'
import React, { useEffect, useState } from 'react'
import { WrapperContentPopup, WrapperHeader, WrapperHeaderAccount, WrapperTextHeader, WrapperTextHeaderSmall } from './style'
import Search from 'antd/es/input/Search'
import {
    UserOutlined,
    CaretDownOutlined,
    ShoppingCartOutlined,
  } from '@ant-design/icons';
import ButtonInputSearch from '../ButtonInputSearch/ButtonInputSearch';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as UserService from '../../service/UserService'
import { resetUser } from '../../redux/slides/userSlide'
import { searchProduct } from '../../redux/slides/productSlide';

const HeaderComponent = ({isHiddenSearch = false, isHiddenCart = false}) => {

  const navigate = useNavigate()
  const user = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const [userName, setUserName] = useState('')
  const [userAvatar, setUserAvatar] = useState('')
  const [search, setSearch] = useState('')
  const order = useSelector((state) => state.order)
  const handleNavigateLogin = () => {
    navigate('/sign-in')
  }

  const handleLogout = async () => {
    await UserService.logoutUser()
    dispatch(resetUser())
  }

  useEffect(() => {
    setUserName(user?.name)
    setUserAvatar(user?.avatar)
  }, [user?.name, user?.avatar])

  const content = (
    <div>
      <WrapperContentPopup onClick={() => navigate('/profile-user')}>Thông tin người dùng</WrapperContentPopup>
      {user?.isAdmin && (
        <WrapperContentPopup onClick={() => navigate('/system/admin')}>Quản lý hệ thống</WrapperContentPopup>
      )}
      <WrapperContentPopup onClick={handleLogout}>Đăng xuất</WrapperContentPopup>
    </div>
  );

  const onSearch = (e) => {
    setSearch(e.target.value)
    dispatch(searchProduct(e.target.value))
  }

  return (
    <div style={{ width: '100%', background: 'rgb(26, 148, 255)', display: 'flex', justifyContent: 'center' }}>
    <WrapperHeader style={{ justifyContent: isHiddenSearch && isHiddenSearch ? 'space-between' : 'unset'}}>
      <Col span={5}>
        <WrapperTextHeader onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>ĐỒ ĐIỆN TỬ XỊN</WrapperTextHeader>
      </Col>
      {!isHiddenSearch && (
        <Col span={13}>
          <ButtonInputSearch 
            size='large'
            textButton='Tìm kiếm'
            placeholder='input search text'
            onChange={onSearch}
          />
        </Col>
      )}
      <Col span={6} style={{ display: 'flex', gap: '54px', alignItems: 'center' }}>
        <WrapperHeaderAccount>
            {userAvatar ? (
              <img src={userAvatar} alt="avatar" style={{
                height: '38px',
                width: '38px',
                borderRadius: '50%',
                objectFit: 'cover'
            }}/>
            ) : (
              <UserOutlined style={{ fontSize: '30px' }} />
            )}
            {user?.access_token ? (
              <>
                <Popover content={content} trigger="click" >
                  <div style={{ cursor: 'pointer' }}>{userName?.length ? userName : user?.email}</div>
                </Popover>
              </>
            ) : (
              <div onClick={handleNavigateLogin} style={{ cursor: 'pointer' }}>
                <WrapperTextHeaderSmall>Đăng nhập/ Đăng ký</WrapperTextHeaderSmall>
                <div>
                    <WrapperTextHeaderSmall>Tài khoản</WrapperTextHeaderSmall>
                    <CaretDownOutlined />
                </div>
              </div>
            )}
            
        </WrapperHeaderAccount>
        {!isHiddenCart && (
          <div onClick={() => navigate('/order')} style={{cursor: 'pointer'}}>
            <Badge count={order?.orderItems?.length} size='small'>
              <ShoppingCartOutlined style={{ fontSize: '30px', color: '#fff' }}/>
            </Badge>
            <WrapperTextHeaderSmall>Giỏ hàng</WrapperTextHeaderSmall>
          </div>
        )}
      </Col>
    </WrapperHeader>
    </div>
  )
}

export default HeaderComponent