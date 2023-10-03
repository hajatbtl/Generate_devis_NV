export const appendPage = (table_name, table_name_capitalize) => {
    return `import axios from 'axios';
    import React, { useEffect, useState } from 'react';
    import DynamicTable from '../../components/DynamicTable';
    import NavbarTitle from '../../components/NavbarTitle';
    import Sidebar from '../../components/Sidebar';

    const ${table_name_capitalize} = () => {
        const [dataRows, setDataRows] = useState([]);
        const [desactive, setDesactive] = useState(0);
        const [filterData, setFilterData] = useState([]);
        const [describe, setDescribe] = useState([]);

        const dataColumns = describe?.filter((key) => !key.includes("_modif") && !key.includes("_crea")).map((key, index) => {
            let column = {
                field: key,
                headerName: key.replace(/^${table_name}_/i, '').charAt(0).toUpperCase() + key.replace(/^${table_name}_/i, '').slice(1),
                width: 200,
                editable: false,
            };
            return column;
        });

        const getDescribe = async () => {
            try {
                const res = await axios.get(\`\${process.env.REACT_APP_API_URL}${table_name}/describe\`);
                const fields = [];
                for (let i = 0; i < res.data.length; i++) {
                    const obj = res.data[i];
                    const keys = Object.keys(obj);
                    for (let j = 0; j < keys.length; j++) {
                        const key = keys[j];
                        if (key === 'Field') {
                            const value = obj[key];
                            fields.push(value);
                        }
                    }
                }
                setDescribe(fields);
            } catch (error) {
                console.log(error);
            }
        }

        useEffect(() => {
            getDescribe();
            const fetshData = async () => {
                try {
                    if (desactive === 0) {
                        const res = await axios.get(\`\${process.env.REACT_APP_API_URL}${table_name}/active\`);
                        setDataRows(res.data);
                        setFilterData(res.data);
                    }
                    else {
                        const res = await axios.get(\`\${process.env.REACT_APP_API_URL}${table_name}/desactive\`);
                        setDataRows(res.data);
                        setFilterData(res.data);
                    }
                } catch (error) {
                    console.log(error);
                }
            };
            fetshData();
        }, [desactive]);
        return (
            <div className='list'>
                <Sidebar field="${table_name}" />
                <div className="listContainer">
                    <NavbarTitle title="Gestion des ${table_name}s" />
                    <DynamicTable describe={describe} dataRows={dataRows} setDataRows={setDataRows} dataColumns={dataColumns} filterData={filterData} setFilterData={setFilterData} desactive={desactive} setDesactive={setDesactive} table_name="${table_name}" />
                </div>
            </div>
        )
    }
export default ${table_name_capitalize};
`}
