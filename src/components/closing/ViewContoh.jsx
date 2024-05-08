import { Table } from 'antd';
import React from 'react'

const ViewContoh = () => {

    const dataSource = [
        {
          key: '1',
          category: 'Category A',
          name: 'Mike',
          age: 32,
          address: '10 Downing Street',
        },
        {
          key: '2',
          category: 'Category A',
          name: 'John',
          age: 42,
          address: '10 Downing Street',
        },
        {
          key: '3',
          category: 'Category B',
          name: 'Jane',
          age: 25,
          address: '10 Downing Street',
        },
        // Tambahkan data lainnya ...
      ];
      
      const columns = [
        {
          title: 'Category',
          dataIndex: 'category',
          key: 'category',
        },
        {
          title: 'Name',
          dataIndex: 'name',
          key: 'name',
          width: '30%',
        },
        {
          title: 'Age',
          dataIndex: 'age',
          key: 'age',
        },
        {
          title: 'Address',
          dataIndex: 'address',
          key: 'address',
        },
      ];

  return (
    <div>
        <Table
      dataSource={dataSource}
      columns={columns}
      summary={(pageData) => {
        let categoryMap = {};
        let subtotals = {};

        pageData.forEach((record) => {
          const category = record.category;
          const age = record.age;

          if (!categoryMap[category]) {
            categoryMap[category] = [];
          }
          categoryMap[category].push(age);
        });

        Object.keys(categoryMap).forEach((category) => {
          const ages = categoryMap[category];
          const totalAge = ages.reduce((acc, curr) => acc + curr, 0);
          subtotals[category] = totalAge;
        });

        return (
          <>
            {Object.keys(subtotals).map((category) => (
              <Table.Summary.Row key={category}>
                <Table.Summary.Cell>Total {category}</Table.Summary.Cell>
                <Table.Summary.Cell colSpan={2}>-</Table.Summary.Cell>
                <Table.Summary.Cell>{subtotals[category]}</Table.Summary.Cell>
                <Table.Summary.Cell />
              </Table.Summary.Row>
            ))}
          </>
        );
      }}
      groupedColumns={['category']} // Menyertakan kolom 'category' untuk grouping summary
    />
    </div>
  )
}

export default ViewContoh