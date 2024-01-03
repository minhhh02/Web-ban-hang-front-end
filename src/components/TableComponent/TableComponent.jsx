import React from 'react';
import { Table } from 'antd';
import { downloadExcel } from 'react-export-table-to-excel';

const TableComponent = (props) => {
    const { selectionType = 'checkbox', data = [], columns = [] } = props;

    // rowSelection object indicates the need for row selection
    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        },
        getCheckboxProps: (record) => ({
            disabled: record.name === 'Disabled User',
            name: record.name,
        }),
    };

    const handleDownloadExcel = () => {
        // Chuẩn bị dữ liệu cho Excel
        const header = columns.map(col => col.title); // Lấy tiêu đề từ cột
        const body = data.map(row => 
            columns.map(col => row[col.dataIndex] || '') // Lấy dữ liệu từ mỗi hàng và cột
        );

        // Sử dụng phương thức downloadExcel từ thư viện
        downloadExcel({
            fileName: "TableData",
            sheet: "Sheet1",
            tablePayload: {
                header,
                body,
            },
        });
    };

    return (
        <div>
            <button onClick={handleDownloadExcel}>Export to Excel</button>
            <Table
                rowSelection={{
                    type: selectionType,
                    ...rowSelection,
                }}
                columns={columns}
                dataSource={data}
                {...props}
            />
        </div>
    );
};

export default TableComponent;
