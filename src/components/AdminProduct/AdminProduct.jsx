import React, { useEffect, useRef, useState } from 'react'
import { WrapperHeader, WrapperUploadFile } from './style'
import { Button, Form, Modal, Space } from 'antd'
import { PlusOutlined, DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons'
import TableComponent from '../TableComponent/TableComponent'
import InputComponent from '../InputComponent/InputComponent'
import { getBase64 } from '../../util'
import * as ProductService from '../../service/ProductService'
import { useMutationHooks } from '../../hooks/useMutationHook'
import * as message from '../../components/Message/Message'
import { useQuery } from '@tanstack/react-query'
import DrawerComponent from '../DrawerComponent/DrawerComponent'
import ModalComponent from '../ModalComponent/ModalComponent'
import { useSelector } from 'react-redux'

const AdminProduct = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rowSelected, setRowSelected] = useState('')
  const [isOpenDrawer, setIsOpenDrawer] = useState(false)
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false)
  const user = useSelector((state) => state?.user)

  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  const [stateProduct, setStateProduct] = useState({
    name: '',
    price: '',
    description: '',
    rating: '',
    image: '',
    type: '',
    countInStock: '',
    discount: ''
  })
  const [stateProductDetails, setStateProductDetails] = useState({
    name: '',
    price: '',
    description: '',
    rating: '',
    image: '',
    type: '',
    countInStock: '',
    discount: '',
  })

  const [form] = Form.useForm();

  const mutation = useMutationHooks(
    (data) => {
      const { 
        name,
        price,
        description,
        rating,
        image,
        type,
        countInStock, discount } = data
      const res = ProductService.createProduct({
        name,
        price,
        description,
        rating,
        image,
        type,
        countInStock,
        discount
        })
        return res
    }
  )

  const mutationDelete = useMutationHooks(
    (data) => {
      const { id,
        token,
      } = data
      const res = ProductService.deleteProduct(
        id,
        token)
      return res
    },
  )

  const getAllProducts = async () => {
    const res = await ProductService.getAllProduct()
    return res
  }

  const fetchGetDetailsProduct = async (rowSelected) => {
    const res = await ProductService.getDetailsProduct(rowSelected)
    if(res?.data) {
      setStateProductDetails({
        name: res?.data?.name,
        price: res?.data?.price,
        description: res?.data?.description,
        rating: res?.data?.rating,
        image: res?.data?.image,
        type: res?.data?.type,
        countInStock: res?.data?.countInStock,
        discount: res?.data?.discount
      })
    }
  }

  console.log('StateProduct', stateProductDetails)
  const handleDetailsProduct = () => {
    if(rowSelected) {
      fetchGetDetailsProduct()
    }
    setIsOpenDrawer(true)
  }

  const { data, isLoading, isSuccess, isError } = mutation
  const { data: dataDeleted, isSuccess: isSuccessDeleted, isError: isErrorDeleted } = mutationDelete

  const queryProduct = useQuery({ queryKey: ['products'], queryFn: getAllProducts })
  const { isLoading: isLoadingProducts, data: products } = queryProduct
  const renderAction = () => {
    return (
      <div>
        <DeleteOutlined style={{color: 'red', fontSize: '26px', cursor: 'pointer'}} onClick={() => setIsModalOpenDelete(true)}/>
        <EditOutlined style={{color: 'orange', fontSize: '26px', cursor: 'pointer'}} />
      </div>
    )
  }

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    // setSearchText(selectedKeys[0]);
    // setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    // setSearchText('');
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <InputComponent
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1890ff' : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    // render: (text) =>
    //   searchedColumn === dataIndex ? (
    //     // <Highlighter
    //     //   highlightStyle={{
    //     //     backgroundColor: '#ffc069',
    //     //     padding: 0,
    //     //   }}
    //     //   searchWords={[searchText]}
    //     //   autoEscape
    //     //   textToHighlight={text ? text.toString() : ''}
    //     // />
    //   ) : (
    //     text
    //   ),
  });

  const columns = [
    {
    title: 'Name',
    dataIndex: 'name',
    sorter: (a, b) => a.name.length - b.name.length,
    ...getColumnSearchProps('name')
    },
    {
    title: 'Price',
    dataIndex: 'price',
    sorter: (a, b) => a.price - b.price
    },
    {
    title: 'Rating',
    dataIndex: 'rating',
    sorter: (a, b) => a.rating - b.rating
    },
    {
    title: 'Type',
    dataIndex: 'type',
    },
    {
    title: 'Action',
    dataIndex: 'action',
    render: renderAction
    },
];
const dataTable = products?.data?.length && products?.data?.map((product) => {
    return {...product, key: product._id}
})

  useEffect(() => {
    if(isSuccess && data?.status === 'OK') {
        message.success()
        handleCancel()
    } else if (isError) {
        message.error()
    }
  }, [isSuccess])

  useEffect(() => {
    if(isSuccessDeleted && dataDeleted?.status === 'OK') {
        message.success()
        handleCancelDelete()
    } else if (isErrorDeleted) {
        message.error()
    }
  }, [isSuccessDeleted])

  const handleCancelDelete = () => {
    setIsModalOpenDelete(false)
  }

  const handleDeleteProduct = () => {
    mutationDelete.mutate({ id: rowSelected, token: user?.access_token }, {
      onSettled: () => {
        queryProduct.refetch()
      }
    })
  }

  const handleCancel = () => {
    setIsModalOpen(false);
    setStateProduct({
        name: '',
        price: '',
        description: '',
        rating: '',
        image: '',
        type: '',
        countInStock: '',
        discount: '',
    })
    form.resetFields()
  };

  const onFinish = () => {
    console.log("stateProduct", stateProduct)
    mutation.mutate(stateProduct)
  }

  const handleOnchange = (e) => {
    setStateProduct({
        ...stateProduct,
        [e.target.name] : e.target.value
    })
  }

  const handleOnchangeDetails = (e) => {
    setStateProductDetails({
        ...stateProductDetails,
        [e.target.name] : e.target.value
    })
  }

  const handleOnchangeAvatar = async ({fileList}) => {
    const file = fileList[0]
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj );
    }
    setStateProduct({
        ...stateProduct,
        image: file.preview
    })
  }

  const handleOnchangeAvatarDetails = async ({fileList}) => {
    const file = fileList[0]
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj );
    }
    setStateProductDetails({
        ...stateProductDetails,
        image: file.preview
    })
  }
  return (
    <div>
        <WrapperHeader>Quản lý sản phẩm</WrapperHeader>
        <div style={{ marginTop: '10px'}}>
            <Button style={{height: '150px', width: '150px', borderRadius: '6px', borderStyle: 'dashed'}} onClick={() => setIsModalOpen(true)}><PlusOutlined style={{ fontSize: '60px'}} /></Button>
        </div>
        <div style={{ marginTop: '20px'}}>
            <TableComponent columns={columns} data={dataTable} onRow={(record, rowIndex) => {
            return {
              onClick: event => {
                setRowSelected(record._id)
              }
            };
            }}/>
        </div>
        <ModalComponent forceRender title="Tạo sản phẩm" open={isModalOpen} onCancel={handleCancel} footer={null} >
        <Form
            name="basic"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            onFinish={onFinish}
            autoComplete="on"
            form={form}
        >
            <Form.Item
            label="Tên sản phẩm"
            name="name"
            rules={[{ required: true, message: 'Please input your name!' }]}
            >
            <InputComponent value={stateProduct.name} onChange={handleOnchange} name="name"/>
            </Form.Item>

            <Form.Item
            label="Type"
            name="type"
            rules={[{ required: true, message: 'Please input your type!' }]}
            >
            <InputComponent value={stateProduct.type} onChange={handleOnchange} name="type"/>
            </Form.Item>

            <Form.Item
            label="Số lượng tồn kho"
            name="countInStock"
            rules={[{ required: true, message: 'Please input your count inStock!' }]}
            >
            <InputComponent value={stateProduct.countInStock} onChange={handleOnchange} name="countInStock"/>
            </Form.Item>

            <Form.Item
            label="Giá tiền"
            name="price"
            rules={[{ required: true, message: 'Please input your price!' }]}
            >
            <InputComponent value={stateProduct.price} onChange={handleOnchange} name="price"/>
            </Form.Item>

            <Form.Item
            label="Mô tả "
            name="description"
            rules={[{ required: true, message: 'Please input your description!' }]}
            >
            <InputComponent value={stateProduct.description} onChange={handleOnchange} name="description"/>
            </Form.Item>

            <Form.Item
            label="Đánh giá"
            name="rating"
            rules={[{ required: true, message: 'Please input your rating!' }]}
            >
            <InputComponent value={stateProduct.rating} onChange={handleOnchange} name="rating"/>
            </Form.Item>

            <Form.Item
              label="Giảm giá"
              name="discount"
              rules={[{ required: true, message: 'Please input your discount!' }]}
              >
              <InputComponent value={stateProductDetails.discount} onChange={handleOnchangeDetails} name="discount"/>
            </Form.Item>

            <Form.Item
            label="Hình ảnh "
            name="image"
            rules={[{ required: true, message: 'Please input your image!' }]}
            >
            <WrapperUploadFile showUploadList={false} onChange={handleOnchangeAvatar} maxCount={1}>
                <Button >Upload file</Button>
                {stateProduct?.image && (
                  <img src={stateProduct?.image} style={{
                      height: '60px',
                      width: '60px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      marginLeft: '10px'
                  }} alt="avatar"/>
                )}
            </WrapperUploadFile>
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 19, span: 16 }}>
            <Button type="primary" htmlType="submit">
                Apply
            </Button>
            </Form.Item>
        </Form>
        </ModalComponent>
        <DrawerComponent title='Chi tiết sản phẩm' isOpen={isOpenDrawer} onClose={() => setIsOpenDrawer(false)} width='50%'>
          <Form
              name="basic"
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 19 }}
              onFinish={onFinish}
              autoComplete="on"
              form={form}
              >
              <Form.Item
              label="Tên sản phẩm"
              name="name"
              rules={[{ required: true, message: 'Please input your name!' }]}
              >
              <InputComponent value={stateProductDetails.name} onChange={handleOnchangeDetails} name="name"/>
              </Form.Item>

              <Form.Item
              label="Type"
              name="type"
              rules={[{ required: true, message: 'Please input your type!' }]}
              >
              <InputComponent value={stateProductDetails.type} onChange={handleOnchangeDetails} name="type"/>
              </Form.Item>

              <Form.Item
              label="Số lượng tồn kho"
              name="countInStock"
              rules={[{ required: true, message: 'Please input your count inStock!' }]}
              >
              <InputComponent value={stateProductDetails.countInStock} onChange={handleOnchangeDetails} name="countInStock"/>
              </Form.Item>

              <Form.Item
              label="Giá tiền"
              name="price"
              rules={[{ required: true, message: 'Please input your price!' }]}
              >
              <InputComponent value={stateProductDetails.price} onChange={handleOnchangeDetails} name="price"/>
              </Form.Item>

              <Form.Item
              label="Mô tả "
              name="description"
              rules={[{ required: true, message: 'Please input your description!' }]}
              >
              <InputComponent value={stateProductDetails.description} onChange={handleOnchangeDetails} name="description"/>
              </Form.Item>

              <Form.Item
              label="Đánh giá"
              name="rating"
              rules={[{ required: true, message: 'Please input your rating!' }]}
              >
              <InputComponent value={stateProductDetails.rating} onChange={handleOnchangeDetails} name="rating"/>
              </Form.Item>

              {/* <Form.Item
              label="Giảm giá"
              name="discount"
              rules={[{ required: true, message: 'Please input your discount!' }]}
              >
              <InputComponent value={stateProductDetails.discount} onChange={handleOnchangeDetails} name="discount"/>
              </Form.Item> */}

              <Form.Item
              label="Hình ảnh "
              name="image"
              rules={[{ required: true, message: 'Please input your image!' }]}
              >
              <WrapperUploadFile showUploadList={false} onChange={handleOnchangeAvatarDetails} maxCount={1}>
                  <Button >Upload file</Button>
                  {stateProductDetails?.image && (
                    <img src={stateProductDetails?.image} style={{
                        height: '60px',
                        width: '60px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        marginLeft: '10px'
                    }} alt="avatar"/>
                  )}
              </WrapperUploadFile>
              </Form.Item>
              <Form.Item wrapperCol={{ offset: 19, span: 16 }}>
              <Button type="primary" htmlType="submit">
                  Submit
              </Button>
              </Form.Item>
          </Form>
        </DrawerComponent>

        <ModalComponent forceRender title="Xóa sản phẩm" open={isModalOpenDelete} onCancel={handleCancelDelete} onOk={handleDeleteProduct} >
            <div>Bạn có chắc chắn muốn xóa sản phẩm này không?</div>
        </ModalComponent>
    </div>
  )
}

export default AdminProduct