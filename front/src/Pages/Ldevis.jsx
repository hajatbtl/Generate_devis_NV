import React, { useState, useEffect, useRef } from 'react';
import { FormOutlined, UserOutlined, LogoutOutlined, PlusOutlined, EditOutlined, EyeOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { Layout, Avatar, Menu, theme, Dropdown, Table, Space, Modal, Input } from 'antd';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import xmlbuilder from 'xmlbuilder';
import Highlighter from 'react-highlight-words';
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from '../components/Sidebar';
import { Content } from 'antd/es/layout/layout';
import Cookies from 'js-cookie';
import dayjs from 'dayjs';
import { Link, useNavigate } from 'react-router-dom';
import Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';

import PizZipUtils from 'pizzip/utils/index.js';
import { useLocation } from 'react-router-dom';

import { saveAs } from 'file-saver';
import axios from 'axios';

const { Header } = Layout;
const ColorList = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae'];
const GapList = [4, 3, 2, 1];



function loadFile(url, callback) {
    PizZipUtils.getBinaryContent(url, callback);
}


const Ldevis = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const iddevis = queryParams.get('id');
    const [html, setHtml] = useState('');
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };
    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };
    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <Input
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
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({
                                closeDropdown: false,
                            });
                            setSearchText(selectedKeys[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Filter
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? '#1677ff' : undefined,
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
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{
                        backgroundColor: '#ffc069',
                        padding: 0,
                    }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });
    const [modal] = Modal.useModal();

    var ImageModule = require('docxtemplater-image-module-free');

    const navigate = useNavigate();

    const handleModifierClick = (id) => {// Replace with your desired ID value
        navigate(`/devis/?id=${id}`); // Navigates to "/other-page/123" (example URL)
    };


    const [isModalOpen, setIsModalOpen] = useState(false);




    const [data, setData] = useState([]);
    const [searchValue, setSearchValue] = useState(null);
    const [filtredData, setFiltredData] = useState([]);

    useEffect(() => {
        const filterByRef = data.filter(item => item.reference.includes(searchValue));
        setFiltredData(filterByRef);
    }, [searchValue])

    const {
        token: { colorBgContainer },
    } = theme.useToken();

    const [color, setColor] = useState(ColorList[0]);
    const [gap, setGap] = useState(GapList[0]);
 
    const [allData, setAllData] = useState({});
    const [formValue, setFormValue] = useState({
        date: '',
        titre_d: '',
        référence: '',
        nomi: Cookies.get("nom") || '',
        prénomi: Cookies.get("prenom") || '',
        teli: Cookies.get("tel") || '',
        maili: Cookies.get("email") || '',
        texte_prerequis: '',
        objet_mission: '',
        texte_visite: '',
        texte_missiondce: '',
        texte_preavis: '',
        accompte: '',
        notation: '',
        has_visite: '',
        has_prevue: '',



        nom: '',
        prenom: '',
        mission: '',
        adresse: '',
        client: '',
        tel: '',
        mail: '',
        adressef: '',
        image: '',
        titre: '',
        reference: '',
        titre_n: '',
        texte_n: '',
        id_d: '',
        id_p: '',

        nom_inter: Cookies.get("nom") || '',
        prenom_inter: Cookies.get("prenom") || '',
        mail_inter: Cookies.get("email") || '',
        tel_inter: Cookies.get("tel") || '',


    });

    const handleMenuClick = (e) => {
        if (e.key === 'logout') {
            Cookies.remove('token')
            Cookies.remove('nom')
            Cookies.remove('prenom')
            Cookies.remove('id')
            Cookies.remove('tel')
            Cookies.remove('email')
            navigate('/')
        }
    };

    const menu = (
        <Menu onClick={handleMenuClick}>
            <Menu.Item key="logout" icon={<LogoutOutlined />}>
                Déconnexion
            </Menu.Item>
        </Menu>
    );

    const getReferance = () => {
        setData()
        let apiUrl
        if (searchValue) {
            apiUrl = `http://localhost:5000/api/devis/reff/${searchValue}`;
        } else {
            apiUrl = `http://localhost:5000/api/devis/ref`;
        }

        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setData(data);
            })
            .catch(error => {
                console.error(error);
            });
    };
    


    useEffect(() => {
        getReferance()
       

    }, [])

    const printToPdf = async (id) => {
        const response = await fetch(`http://localhost:5000/api/devis/getHtml/${id}`);
        const html = await response.text(); // Supposons que la réponse est du texte HTML
        if (html) {
            const printWindow = window.open('', '_blank');
    
            const headerContent = `
                <div style="position: fixed; top: 5px; width: 100%; text-align: left; font-family: Century Gothic; font-size: 10px; color: #002060;">
                  <tr>
                    <td>
                    REFERENCE DEVIS:
                    </td>
                    <td>
                    ${formValue.référence}
                    </td>
                </tr><br>
                  <tr>
                    <td>
                    MISSION:
                    </td>
                    <td>
                    ${formValue.mission}
                    </td>
                </tr><br>
                  <tr>
                    <td>
                    CLIENT:
                    </td>
                    <td>
                    ${formValue.nom_c}
                    </td>
                </tr>
                    <hr style="border: 1px solid #002060; border-radius: 5px;" />
                </div>
            `;
    
            const footerContent = `
                <div style="position: fixed; bottom: 5px; width: 100%; text-align: left; padding-top: 100px; font-family: Century Gothic; font-size: 10px; color: #002060;">
                    <hr style="border: 1px solid #002060; border-radius: 5px;" />
                    <div>
                        SKY INGENIERIE <br>
                        30, rue Charles de Gaulle – 94140 Alfortville<br>
                        Société par actions simplifiées au capital de 50000€<br>
                        842683666 RCS Créteil<br>
                        Tel : 01.43.53.26.89<br>
                    </div>
                </div>
            `;
    
            printWindow.document.write(`
                <html>
                <head>
                    <title>PDF Export</title>
                    <style>
                        @media print {
                            body {
                                margin: 0;
                                padding: 0;
                            }
                            .page {
                                page-break-after: always;
                                position: relative;
                                width: 100%;
                                height: 100%;
                            }
                            .header {
                                position: fixed;
                                top: 5px;
                                width: 100%;
                                text-align: left;
                                font-family: Century Gothic;
                                font-size: 10px;
                                color: #002060;
                            }
                            .footer {
                                display: none; /* Cacher le footer par défaut */
                            }
                            .page + .footer {
                                display: block; /* Afficher le footer à partir de la deuxième page */
                            }
                        }
                    </style>
                </head>
                <body>
                    <div class="header">${headerContent}</div>
                    <div class="page">${html}</div>
                    <div class="footer">${footerContent}</div>
                </body>
                </html>
            `);
    
            printWindow.document.close();
            printWindow.print();
        }
    };
    const columns1 = [
        {
            title: 'Référance',
            dataIndex: 'reference',
            key: 'reference',
            ...getColumnSearchProps('reference'),

        },
        {
            title: 'Client',
            dataIndex: 'nom_client',
            key: 'nom_client',
            ...getColumnSearchProps('nom_client'),
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            ...getColumnSearchProps('date'),




        },
        {
            title: 'Interlocuteur',
            dataIndex: 'nom_inter',
            key: 'nom',
            ...getColumnSearchProps('nom_inter'),
        },

        {
            title: 'Action',

            render: (_, record) => (

                <Space size="middle">

                    <Button size="sm"  onClick={() => navigate(`/Devis/Htmlfile/?id=${record.id_d}`)}>
                        < EyeOutlined className='fs-5 m-1' ></EyeOutlined >
                    </Button>


                    <Button size="sm" className="bg-success " onClick={() => {
                        handleModifierClick(record.id_d);
                        console.log('devisIddd :  ', record.id_d);
                    }} >
                        < EditOutlined className='fs-5 m-1' ></EditOutlined>
                    </Button>


                    <Button size="sm" variant="danger"
                        onClick={() => {

                            Modal.confirm({
                                icon: <DeleteOutlined className='text-danger' />,
                                okButtonProps: { className: 'btn-danger' },
                                content: 'Êtes-vous certain de vouloir supprimer ce devis ?',
                                okText: 'Supprimer',
                                cancelText: 'Annuler',
                                onOk: () => {
                                    let id = record.id_d;

                                    fetch('http://localhost:5000/api/devis/delete/' + id, {
                                        method: 'DELETE',
                                        headers: { 'Content-Type': 'application/json' }
                                    })
                                        .then(response => response.json())
                                        .then(data => {
                                            getReferance()
                                        });

                                }
                            });


                        }}
                    >
                        <DeleteOutlined className='fs-5 m-1' ></DeleteOutlined></Button>
                </Space>
            ),
        }

    ]
    // const convertToDocxXml = (html) => {
    //     // Create a temporary div element to parse the HTML content
    //     const tempDiv = document.createElement('div');
    //     tempDiv.innerHTML = html;

    //     // Initialize an empty string to store the Word XML
    //     let wordXml = '';

    //     // Helper function to recursively process list items and their children
    //     const processListItems = (list, level) => {
    //         wordXml += `<w:p><w:pPr><w:pStyle w:val="ListParagraph"/><w:numPr><w:ilvl w:val="${level}"/><w:numId w:val="1"/></w:numPr></w:pPr><w:r><w:t>`;
    //         list.childNodes.forEach((item) => {
    //             if (item.tagName === 'LI') {
    //                 wordXml += item.textContent;
    //             } else if (item.tagName === 'OL' || item.tagName === 'UL') {
    //                 processListItems(item, level + 1);
    //             }
    //         });
    //         wordXml += '</w:t></w:r></w:p>';
    //     };

    //     // Iterate through each paragraph (p) and list (ol and ul) elements in the parsed HTML
    //     tempDiv.childNodes.forEach((element) => {
    //         if (element.tagName === 'P') {
    //             const strong = element.querySelector('strong');
    //             const text = element.textContent;

    //             // Build the Word XML for each paragraph based on the presence of strong tags
    //             wordXml += '<w:p>';
    //             wordXml += '<w:r>';
    //             wordXml += '<w:rPr>';
    //             if (strong) {
    //                 wordXml += '<w:b/>';
    //             }
    //             wordXml += '</w:rPr>';
    //             wordXml += `<w:t>${text}</w:t>`;
    //             wordXml += '</w:r>';
    //             wordXml += '</w:p>';
    //         } else if (element.tagName === 'OL' || element.tagName === 'UL') {
    //             // Process lists and their items
    //             processListItems(element, 0);
    //         }
    //     });

    //     return wordXml;
    // };
    const getData = async (id, idDevis) => {
        await fetch('http://localhost:5000/api/devis/devisall/' + idDevis, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        })
            .then(response => response.json())
            .then((data) => {
                if (data) {
                    console.log('babababab:   , ', data)
                    setFormValue({
                        ...formValue,
                        date: data.devis.date,
                        référence: data.devis.reference,
                        titre_d: data.devis.titre_d,
                        // nomi: data.devis.nom_inter,
                        // prénomi: data.devis.prenom_inter,
                        // teli: data.devis.tel_inter,
                        // maili: data.devis.mail_inter,
                        adressef: data.client.adressef,
                        mail: data.client.mail,
                        tel: data.client.tel,
                        adresse: data.client.adresse,
                        mission: data.client.mission,
                        nom: data.client.nom,
                        prenom: data.client.prenom,
                        nom_c: data.client.nom_c,
                        image: data.client.image,
                        nom_inter: data.devis.nom_inter,
                        prenom_inter: data.devis.prenom_inter,
                        mail_inter: data.devis.mail_inter,
                        tel_inter: data.devis.tel_inter,
                        prestationslist: data.prestation,
                        notatslist: data.notats,
                        texte_prerequis: data.devis.prerequis,
                        objet_mission: data.devis.objet_mission,
                        notation: data.devis.notation,
                        has_visite: data.devis.has_visite,
                        has_prevue: data.devis.has_prevue,
                        texte_visite: data.devis.visite,
                        texte_missiondce: data.devis.mission_dec,
                        texte_preavis: data.devis.preavis,
                        accompte: data.devis.accompte,
                    });


                    let totalHT = 0
                    let totalTTC = 0
                    let tva = 0
                    data.prestation.forEach(presta => {
                        totalHT += presta.prix
                    });
                    tva = totalHT * 20 / 100
                    totalTTC = tva + totalHT
                    let accompteCond = formValue.accompte == 100 ? false : true

                    generateDevis({
                        ...formValue,
                        date: data.devis.date,
                        référence: data.devis.reference,
                        titre_d: data.devis.titre_d,
                        // nomi: data.devis.nom_inter,
                        // prénomi: data.devis.prenom_inter,
                        // teli: data.devis.tel_inter,
                        // maili: data.devis.mail_inter,
                        adressef: data.client.adressef,
                        mail: data.client.mail,
                        tel: data.client.tel,
                        adresse: data.client.adresse,
                        mission: data.client.mission,
                        nom: data.client.nom,
                        prenom: data.client.prenom,
                        nom_c: data.client.nom_c,
                        image: data.client.image,
                        nom_inter: data.devis.nom_inter,
                        prenom_inter: data.devis.prenom_inter,
                        mail_inter: data.devis.mail_inter,
                        tel_inter: data.devis.tel_inter,
                        prestationslist: data.prestation,
                        notatslist: data.notats,
                        texte_prerequis: data.devis.prerequis,
                        objet_mission: data.devis.objet_mission,
                        notation: data.devis.notation,
                        has_visite: data.devis.has_visite,
                        has_prevue: data.devis.has_prevue,
                        texte_visite: data.devis.visite,
                        texte_missiondce: data.devis.mission_dec,
                        texte_preavis: data.devis.preavis,
                        accompte: data.devis.accompte,
                        totalHT: totalHT,
                        totalTTC: totalTTC,
                        tva: tva,
                        accompteCond: accompteCond
                    });
                }
            })
    

    }

    useEffect(() => {
        console.log(formValue)
    }, [formValue])

    const generateDevis = async (record) => {

        console.log(record)
        loadFile(
            require('../../src/devis.docx'),
            function (error, content) {
                if (error) {
                    console.error(error);
                    return;
                }

                const zip = new PizZip(content);
                const doc = new Docxtemplater(zip);
                // console.log(formValue)
                doc.renderAsync(record).then(function () {
                    const out = doc.getZip().generate({
                        type: 'blob',
                        mimeType:
                            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    });
                    saveAs(out, "generated.docx");
                });
            }
        );

    };

    return (

        <Layout>
            <Sidebar />

            <Layout className="site-layout " style={{ backgroundColor: '#001529' }}>
                <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 100 }}>
                    <span style={{ fontSize: '17px', color: 'white' }}>
                        <FormOutlined className='fs-3 pe-4' />
                        Les devis
                    </span>
                    <div className='d-flex justify-content-betwen align-items-baseline gap-3'>
                        <p style={{ color: '#ffff' }}>{Cookies.get('nom') + ' ' + Cookies.get('prenom')}</p>

                        <Dropdown overlay={menu} placement="bottomRight">
                            <Avatar
                                style={{
                                    backgroundColor: color,
                                    verticalAlign: 'middle',
                                }}
                                size="large"
                                gap={gap}
                                icon={<UserOutlined />}
                            >

                            </Avatar>

                        </Dropdown>
                    </div>
                </Header>

                <Content

                    className='mb-4'
                    style={{
                        margin: '0px 16px',
                        padding: 24,
                        minHeight: 280,
                        borderRadius: 20,
                        background: '#fff',

                    }}
                ><Row>
                        <div className='d-flex  justify-content-between align-items-center'>
                            <div >
                                <Link to="/devis">
                                    <Button  ><PlusOutlined className='mx-2 ' />Nouveau devis</Button>
                                </Link>
                            </div>

                            {/* <div>
                                <label>Rechercher par la référance</label>

                                <Input name='reference' onChange={(e) => setSearchValue(e.target.value)} placeholder="Référance" />
                            </div> */}


                        </div>


                    </Row>

                    <Row className='justify-content-center align-items-center'>
                        <Table className='mt-5' style={{ width: '100%' }} columns={columns1} dataSource={filtredData.length > 0 ? filtredData : data} />
                    </Row>
                </Content>

            </Layout>
        </Layout>

    );
};
export default Ldevis;