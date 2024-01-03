import React from 'react'
import ProductDetailsComponent from '../../components/ProductDetailsComponent/ProductDetailsComponent'
import { useNavigate, useParams } from 'react-router-dom'

const ProductDetailsPage = () => {
  const {id} = useParams()
  const navigate = useNavigate()
  return (
    <div style={{ padding: '0 120px', background: '#efefef', height: '1000px' }}>
      <h5><span style={{cursor: 'pointer', fontWeight: 'bold', fontSize: '18px'}} onClick={() => {navigate('/')}}>Trang chủ</span> - <span style={{ fontSize: '18px'}}>Chi tiết sản phẩm</span></h5>
      <ProductDetailsComponent idProduct={id}/>
    </div>
  )
}

export default ProductDetailsPage