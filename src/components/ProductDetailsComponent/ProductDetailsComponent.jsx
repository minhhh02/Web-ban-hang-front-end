import { Col, Image, InputNumber, Rate, Row } from 'antd'
import React, { useState } from 'react'
import imageProduct from '../../assets/images/test.webp'
import imageProductSmall from '../../assets/images/imagesmall.webp'
import { WrapperAddressProduct, WrapperBtnQualityProduct, WrapperInputNumber, WrapperPriceProduct, WrapperPriceTextProduct, WrapperQualityProduct, WrapperStyleColImage, WrapperStyleImageSmall, WrapperStyleNameProduct, WrapperStyleTextSell } from './style'
import {
  StarFilled,
  PlusOutlined,
  MinusOutlined,
} from '@ant-design/icons';
import ButtonComponent from '../ButtonComponent/ButtonComponent'
import * as ProductService from '../../service/ProductService'
import { useQuery } from '@tanstack/react-query'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { addOrderProduct } from '../../redux/slides/orderSlide'
import { convertPrice } from '../../util'


const ProductDetailsComponent = ({idProduct}) => {
  const [numProduct, setNumProduct] = useState(1)
  const user = useSelector((state) => state.user)
  const order = useSelector((state) => state.order)
  const [errorLimitOrder,setErrorLimitOrder] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()

  const onChange = (value) => { 
    setNumProduct(Number(value))
  }

  const fetchGetDetailsProduct = async (context) => {
    const id = context?.queryKey && context?.queryKey[1]
    if(id) {
        const res = await ProductService.getDetailsProduct(id)
        return res.data
    }
  }

  const handleChangeCount = (type, limited) => {
    if(type === 'increase') {
        if(!limited) {
            setNumProduct(numProduct + 1)
        }
    }else {
        if(!limited) {
            setNumProduct(numProduct - 1)
        }
    }
  }

  const { isLoading, data: productDetails } = useQuery(['product-details', idProduct], fetchGetDetailsProduct, { enabled : !!idProduct})

  const handleAddOrderProduct = () => {
    if(!user?.id) {
        navigate('/sign-in', {state: location?.pathname})
    }else {
        // {
        //     name: { type: String, required: true },
        //     amount: { type: Number, required: true },
        //     image: { type: String, required: true },
        //     price: { type: Number, required: true },
        //     product: {
        //         type: mongoose.Schema.Types.ObjectId,
        //         ref: 'Product',
        //         required: true,
        //     },
        // },
        const orderRedux = order?.orderItems?.find((item) => item.product === productDetails?._id)
        if((orderRedux?.amount + numProduct) <= orderRedux?.countInstock || (!orderRedux && productDetails?.countInStock > 0)) {
            dispatch(addOrderProduct({
                orderItem: {
                    name: productDetails?.name,
                    amount: numProduct,
                    image: productDetails?.image,
                    price: productDetails?.price,
                    product: productDetails?._id,
                    discount: productDetails?.discount,
                    countInstock: productDetails?.countInStock
                }
            }))
        } else {
            setErrorLimitOrder(true)
        }
    }
}

  return (
    <Row style ={{ padding: '16px', background: '#fff', borderRadius: '4px' }}>
        <Col span={10} style = {{ borderRight: '1px solid #e5e5e5', paddingRight: '8px' }}>
            <Image src={productDetails?.image} alt='image product' preview={false} />
            <Row style={{ paddingTop: '10px', justifyContent: 'space-between' }}>
                <WrapperStyleColImage span={4}>
                <WrapperStyleImageSmall src={imageProductSmall} alt='image small' preview={false} />
                </WrapperStyleColImage>
                <WrapperStyleColImage span={4}>
                <WrapperStyleImageSmall src={imageProductSmall} alt='image small' preview={false} />
                </WrapperStyleColImage>
                <WrapperStyleColImage span={4}>
                <WrapperStyleImageSmall src={imageProductSmall} alt='image small' preview={false} />
                </WrapperStyleColImage>
                <WrapperStyleColImage span={4}>
                <WrapperStyleImageSmall src={imageProductSmall} alt='image small' preview={false} />
                </WrapperStyleColImage>
                <WrapperStyleColImage span={4}>
                <WrapperStyleImageSmall src={imageProductSmall} alt='image small' preview={false} />
                </WrapperStyleColImage>
                <WrapperStyleColImage span={4}>
                <WrapperStyleImageSmall src={imageProductSmall} alt='image small' preview={false} />
                </WrapperStyleColImage>
            </Row>
        </Col>
        <Col span={14} style = {{ paddingLeft: '10px' }}>
          <WrapperStyleNameProduct>{productDetails?.name}</WrapperStyleNameProduct>
          <div>
            <Rate allowHalf defaultValue={productDetails?.rating} value={productDetails?.rating} />
            <WrapperStyleTextSell> | Da ban 1000+</WrapperStyleTextSell>
          </div>
          <WrapperPriceProduct>
            <WrapperPriceTextProduct>{convertPrice(productDetails?.price)}</WrapperPriceTextProduct>
          </WrapperPriceProduct>
          <WrapperAddressProduct>
            <span>Giao đến </span>
            <span className='address'>{user?.address} </span> -
            <span className='change-address'> Đổi địa chỉ </span>
          </WrapperAddressProduct>
          <div style = {{ margin: '10px 0 20px', padding: '10px 0', borderTop: '1px solid #e5e5e5', borderBottom: '1px solid #e5e5e5' }}>
            <div style = {{ marginBottom: '10px' }}> Số lượng </div>
            <WrapperQualityProduct>
              <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }} onClick={() => handleChangeCount('decrease',numProduct === 1)}>
                <MinusOutlined style={{ fontSize: '16px' }} />
              </button>
                <WrapperInputNumber onChange={onChange} defaultValue={1} max={productDetails?.countInStock} min={1} value={numProduct} size='small' />
              <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }} onClick={() => handleChangeCount('increase',  numProduct === productDetails?.countInStock)}>  
                <PlusOutlined style={{ fontSize: '16px' }} />
              </button >
            </WrapperQualityProduct>
          </div>
          <div style = {{ display: 'flex', alignItems: 'center', gap: '12px'}}>
              <ButtonComponent
                  size={40}
                  styleButton={{
                     background: 'rgb(255, 57, 69)',
                      height: '48px',
                      width: '220px',
                      border: 'none',
                      borderRadius: '4px',
                    }}
                  onClick={handleAddOrderProduct}
                  textButton={'Chọn mua'}
                  styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
              ></ButtonComponent>
              <ButtonComponent
                  size={40}
                  styleButton={{
                     background: '#fff',
                      height: '48px',
                      width: '220px',
                      border: '1 px solid rgb(13, 92, 182)',
                      borderRadius: '4px',
                    }}
                  textButton={'Mua trả sau'}
                  styleTextButton={{ color: 'rgb(13, 92, 182)', fontSize: '15px' }}
              ></ButtonComponent>
          </div>
        </Col>
    </Row>
  )
}

export default ProductDetailsComponent