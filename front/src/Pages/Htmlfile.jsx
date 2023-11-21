import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';
import img1 from '../img/image3.PNG';

const Htmlfile = () => {
    const [html, setHtml] = useState('');
    const contentRef = useRef();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const iddevis = queryParams.get('id');
    const [data, setData] = useState(null);

    const [formValue, setFormValue] = useState({

        référence: "",
        mission: "",
        nom_c: "",
    })


    useEffect(() => {
        if (iddevis !== null) {
            fetch('http://localhost:5000/api/devis/devisall/' + iddevis, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            })
                .then(response => response.json())
                .then((data) => {
                    if (data) {
                        setFormValue({
                            ...formValue,

                            référence: data.devis.reference,
                            mission: data.client.mission,
                            nom_c: data.client.nom_c,

                        });



                    } else {
                        console.log("Data is empty");
                    }
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });
        }
    }, []);
    const navigate = useNavigate()

    const savehtml = () => {
        const content = document.getElementById('content').innerHTML;
        const fullHTML = `<!DOCTYPE html>
        <html lang="en">
        <head>
          <title>Bootstrap Example</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
        </head>
        <body>
          ${content}
        </body>
        </html>`;

        fetch(`http://localhost:5000/api/devis/savehtml`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ html: fullHTML, id: iddevis }),
        })
            .then(response => {
                if (response.ok) {
                    return response.text();
                }
                throw new Error('Error while saving HTML');
            })
            .then(data => {
                navigate('/Devis/Liste');
                console.log(data);
            })
            .catch(error => {
                console.error('Error while saving HTML:', error);
            });
    };


    const gethtml = () => {
        fetch(`http://localhost:5000/api/devis/getHtml/${iddevis}`)
            .then(response => response.text())
            .then(data => {
                setHtml(data);
                console.log(data);
            })
            .catch(error => {
                console.error(error);
            });
    };


    const printToPdf = () => {
        const content = contentRef.current;

        if (content) {
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
                    <div class="page">${content.innerHTML}</div>
                    <div class="footer">${footerContent}</div>
                </body>
                </html>
            `);

            printWindow.print();

        }
    };




    useEffect(() => {
        gethtml();
    }, [iddevis]);

    return (
        <>
            <div className='mt-5 d-flex justify-content-between'>

                <Button style={{ marginLeft: '150px',paddingBottom: '40px' }} size="sm" className='btn btn-primary'  onClick={() => { navigate('/Devis/Liste') }}>
                    < HomeOutlined className='fs-5 m-1' ></HomeOutlined >
                </Button>
                <div className='btn btn-primary d-flex gap-2 'style={{ marginRight: '200px' }}>
                <Button onClick={savehtml}>Enregistrer</Button>
                <Button onClick={printToPdf}>Export to PDF</Button>
                </div>
            </div>




           

            <div
                id='content'
                ref={contentRef}
                contentEditable={true}
                dangerouslySetInnerHTML={{ __html: html }}
            />
        </>
    );
};

export default Htmlfile;