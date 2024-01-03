import React, { useEffect, useRef, useState } from 'react'
import { WrapperHeader, WrapperUploadFile } from './style'
import { Button, Form, Space } from 'antd'
import TableComponent from '../TableComponent/TableComponent'
import InputComponent from '../InputComponent/InputComponent'
import DrawerComponent from '../DrawerComponent/DrawerComponent'
import ModalComponent from '../ModalComponent/ModalComponent'
import { getBase64 } from '../../util'
import * as message from '../../components/Message/Message'
import { useSelector } from 'react-redux'
import { useMutationHooks } from '../../hooks/useMutationHook'
import * as UserService from '../../service/UserService'
import { useQuery } from '@tanstack/react-query'
import { PlusOutlined, DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons'

const AdminUser = () => {
  const [rowSelected, setRowSelected] = useState('')
  const [isOpenDrawer, setIsOpenDrawer] = useState(false)
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false)
  const user = useSelector((state) => state?.user)
  const searchInput = useRef(null);

  const [stateUserDetails, setStateUserDetails] = useState({
    name: '',
    price: '',
    phone: '',
    isAdmin: false,
    avatar: '',
    address: ''
  })

  const [form] = Form.useForm();

  const mutationUpdate = useMutationHooks(
    (data) => {
      const { id,
        token,
        ...rests } = data
      const res = UserService.updateUser(
        id,
        { ...rests }, token)
      return res
    },
  )

  const mutationDelete = useMutationHooks(
    (data) => {
      const { id,
        token,
      } = data
      const res = UserService.deleteUser(
        id,
        token)
      return res
    },
  )

  const getAllUsers = async () => {
    const res = await UserService.getAllUser(user?.access_token)
    return res
  }

  const fetchGetDetailsUser = async (rowSelected) => {
    const res = await UserService.getDetailsUser(rowSelected)
    if(res?.data) {
      setStateUserDetails({
        name: res?.data?.name,
        email: res?.data?.email,
        phone: res?.data?.phone,
        isAdmin: res?.data?.isAdmin,
        address: res?.data?.address,
        avatar: res.data?.avatar
      })
    }
  }

  useEffect(() => {
    form.setFieldsValue(stateUserDetails)
  }, [form, stateUserDetails])

  useEffect(() => {
    if(rowSelected) {
      fetchGetDetailsUser(rowSelected)
    }
  }, [rowSelected])

  const handleDetailsProduct = () => {
    setIsOpenDrawer(true)
  }

  const { data: dataUpdated, isSuccess: isSuccessUpdated, isError: isErrorUpdated } = mutationUpdate
  const { data: dataDeleted, isSuccess: isSuccessDeleted, isError: isErrorDeleted } = mutationDelete

  const queryUser = useQuery({ queryKey: ['users'], queryFn: getAllUsers })
  const { isLoading: isLoadingUsers, data: users } = queryUser
  const renderAction = () => {
    return (
      <div>
        <DeleteOutlined style={{color: 'red', fontSize: '26px', cursor: 'pointer'}} onClick={() => setIsModalOpenDelete(true)}/>
        <EditOutlined style={{color: 'orange', fontSize: '26px', cursor: 'pointer'}} onClick={handleDetailsProduct}/>
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
      title: 'Email',
      dataIndex: 'email',
      sorter: (a, b) => a.email.length - b.email.length,
      ...getColumnSearchProps('email')
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      sorter: (a, b) => a.address.length - b.address.length,
      ...getColumnSearchProps('address')
    },
    {
      title: 'Admin',
      dataIndex: 'isAdmin',
      sorter: (a, b) => a.isAdmin.length - b.isAdmin.length
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      sorter: (a, b) => a.phone - b.phone,
      ...getColumnSearchProps('phone')
    },
    {
      title: 'Action',
      dataIndex: 'action',
      render: renderAction
    },
];
const dataTable = users?.data?.length && users?.data?.map((user) => {
    return {...user, key: user._id, isAdmin: user.isAdmin ? 'Quản trị viên': 'Khách hàng' }
})

  useEffect(() => {
    if(isSuccessDeleted && dataDeleted?.status === 'OK') {
        message.success()
        handleCancelDelete()
    } else if (isErrorDeleted) {
        message.error()
    }
  }, [isSuccessDeleted])

  const handleCloseDrawer = () => {
    setIsOpenDrawer(false);
    setStateUserDetails({
      name: '',
      email: '',
      phone: '',
      isAdmin: false,
    })
    form.resetFields()
  };

  useEffect(() => {
    if (isSuccessUpdated && dataUpdated?.status === 'OK') {
      message.success()
      handleCloseDrawer()
    } else if (isErrorUpdated) {
      message.error()
    }
  }, [isSuccessUpdated])

  const handleCancelDelete = () => {
    setIsModalOpenDelete(false)
  }

  const handleDeleteUser = () => {
    mutationDelete.mutate({ id: rowSelected, token: user?.access_token }, {
      onSettled: () => {
        queryUser.refetch()
      }
    })
  }

  const handleOnchangeDetails = (e) => {
    setStateUserDetails({
        ...stateUserDetails,
        [e.target.name] : e.target.value
    })
  }

  const handleOnchangeAvatarDetails = async ({fileList}) => {
    const file = fileList[0]
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj );
    }
    setStateUserDetails({
        ...stateUserDetails,
        avatar: file.preview
    })
  }

  const onUpdateUser = () => {
    mutationUpdate.mutate({ id: rowSelected, token: user?.access_token, ...stateUserDetails }, {
      onSettled: () => {
        queryUser.refetch()
      }
    })
  }
  return (
    <div>
        <WrapperHeader>Quản lý người dùng</WrapperHeader>
        <div style={{ marginTop: '20px'}}>
            <TableComponent columns={columns} data={dataTable} onRow={(record, rowIndex) => {
            return {
              onClick: event => {
                setRowSelected(record._id)
              }
            };
            }}/>
        </div>
        <DrawerComponent title='Chi tiết người dùng' isOpen={isOpenDrawer} onClose={() => setIsOpenDrawer(false)} width='50%'>
          <Form
              name="basic"
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 19 }}
              onFinish={onUpdateUser}
              autoComplete="on"
              form={form}
              >
              <Form.Item
              label="Tên sản phẩm"
              name="name"
              rules={[{ required: true, message: 'Please input your name!' }]}
              >
              <InputComponent value={stateUserDetails['name']} onChange={handleOnchangeDetails} name="name"/>
              </Form.Item>

              <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: 'Please input your email!' }]}
              >
              <InputComponent value={stateUserDetails.email} onChange={handleOnchangeDetails} name="email"/>
              </Form.Item>

              <Form.Item
              label="Số điện thoại"
              name="phone"
              rules={[{ required: true, message: 'Please input your phone!' }]}
              >
              <InputComponent value={stateUserDetails.phone} onChange={handleOnchangeDetails} name="phone"/>
              </Form.Item>

              <Form.Item
              label="Địa chỉ"
              name="address"
              rules={[{ required: true, message: 'Please input your address!' }]}
              >
              <InputComponent value={stateUserDetails.address} onChange={handleOnchangeDetails} name="address"/>
              </Form.Item>

              <Form.Item
              label="Ảnh đại diện "
              name="avatar"
              rules={[{ required: true, message: 'Please input your avatar!' }]}
              >
              <WrapperUploadFile showUploadList={false} onChange={handleOnchangeAvatarDetails} maxCount={1}>
                  <Button >Upload file</Button>
                  {stateUserDetails?.avatar && (
                    <img src={stateUserDetails?.avatar} style={{
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
        </DrawerComponent>

        <ModalComponent forceRender title="Xóa người dùng" open={isModalOpenDelete} onCancel={handleCancelDelete} onOk={handleDeleteUser} >
            <div>Bạn có chắc chắn muốn xóa tài khoản này không?</div>
        </ModalComponent>
    </div>
  )
}

export default AdminUser