import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function EditingInterface({ initialHtml, onUpdateHtml }) {
  const [html, setHtml] = useState(initialHtml);

  const handleHtmlChange = (newHtml) => {
    setHtml(newHtml);
  };

  const handleSave = () => {
    onUpdateHtml(html);
  };

  return (
    <div>
      <ReactQuill value={html} onChange={handleHtmlChange} />
      <button onClick={handleSave}>Save Changes</button>
    </div>
  );
}

export default EditingInterface;
