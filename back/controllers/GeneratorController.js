import fs from 'fs/promises';
import path from 'path';
import fse from 'fs-extra';
import { crud_api } from '../generators/crud_generat.js';
import { routes_api } from '../generators/routes_generat.js';
import { append_Index } from '../generators/index_generat.js';
import { appendImport, appendRoute } from '../generators/app_generator.js';
import { appendPage } from '../generators/page_generator.js';

export const generateApi = async (req, res) => {
    const table = req.params.table;
    const correctTableName = table.includes('_') ? table.split('_')[1] : table;
    const correctTableNameToUpperCase = correctTableName.replace(/^\w/, c => c.toUpperCase());;
    const controllerFile = `controllers/${correctTableName}Controller.js`;
    const routeFile = `routes/${correctTableName}.js`;
    try {
        // Create the controller file
        fse.outputFile(controllerFile, crud_api(correctTableName))
            .then(() => {
                console.log('The controller has been saved!');
            })
            .catch(err => {
                console.error(err)
            });

        // Create the route file
        fse.outputFile(routeFile, routes_api(correctTableName))
            .then(() => {
                console.log('The route has been saved!');
            })
            .catch(err => {
                console.error(err)
            });

        // Update the index file
        fse.readFile('index.js', (err, data) => {
            if (err) throw err;
            if (!data.includes(append_Index(correctTableName))) {
                fse.appendFile('index.js', append_Index(correctTableName), () => {
                    console.log('index file updated!');
                })
            }
            else {
                console.log('Le nouveau contenu existe déjà dans le fichier index.js.');
            }
        });

        // Update App File
        // const filePathAppJS = path.join('api/controllers', '..', '..', '..', 'client', 'src', 'App.js');
        // fse.readFile(filePathAppJS, 'utf-8', (err, data) => {
        //     if (err) {
        //         console.error(err);
        //     }
        //     else {
        //         const newData = appendImport(correctTableName, correctTableNameToUpperCase) + data;
        //         const appendData = newData.replace(/(<\/Route>)/, `${appendRoute(correctTableName, correctTableNameToUpperCase)}$1`);
        //         if (!data.includes(appendImport(correctTableName, correctTableNameToUpperCase)) && !data.includes(appendRoute(correctTableName, correctTableNameToUpperCase))) {
        //             fs.writeFile(filePathAppJS, appendData, err => {
        //                 if (err) {
        //                     console.error(err);
        //                 }
        //                 else {
        //                     console.log('File updated successfully.')
        //                 }
        //             });
        //         }
        //         else {
        //             console.log('Le nouveau contenu existe déjà dans le fichier App.js.');
        //         }
        //     }
        // });

        // // Create Jsx file
        // const filePathJSXPage = path.join('api/controllers', '..', '..', '..', 'client', 'src', 'pages', 'admin', `${correctTableNameToUpperCase}.jsx`);
        // fse.outputFile(filePathJSXPage, appendPage(correctTableName, correctTableNameToUpperCase))
        //     .then(() => {
        //         console.log('The jsx page has been saved!');
        //     })
        //     .catch(err => {
        //         console.error(err)
        //     });

        // // Update Data file
        // const filePathData = path.join('api/controllers', '..', '..', '..', 'client', 'src', 'data.js');
        // fse.readFile(filePathData, (err, data) => {
        //     if (err) throw err;
        //     if (!data.includes(correctTableNameToUpperCase)) {
        //         const newData = data.toString().replace(/(];)/, `"${correctTableNameToUpperCase}",\n];`);
        //         fse.writeFile(filePathData, newData, (err, data) => {
        //             if (err) { console.log(err); }
        //             else { console.log(data); console.log("successful") }
        //         });
        //     }
        //     else {
        //         console.log('Le nouveau contenu existe déjà dans le fichier data.js.');
        //     }
        // });
        res.redirect(`/api/${correctTableName}`);
    } catch (error) {
        console.log(error);
    };
}