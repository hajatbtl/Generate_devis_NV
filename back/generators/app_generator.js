export const appendImport = (table_name, table_name_capitalize) => {
    return `import ${table_name_capitalize} from "./pages/admin/${table_name_capitalize}";\n`;
}

export const appendRoute = (table_name, table_name_capitalize) => {
    return `<Route path="${table_name}" element={<${table_name_capitalize} />} />\n`;
}
