export const append_Index = (table_name) => {
    return `import ${table_name}Routes from "./routes/${table_name}.js";
    app.use(\`/api/${table_name}/\`, ${table_name}Routes);
    `;
}