import React, { useState } from 'react';

const Analysis = () => {
  const [selectedCrop, setSelectedCrop] = useState('');
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file)); // Предпросмотр фото
    }
  };

  return (
    <section className="analysis-section" style={{ marginTop: '100px' }}>
      <div className="container">
        <h2>Анализ состояния культур</h2>
        <div className="analysis-grid">
          <div className="upload-box">
            <select 
              value={selectedCrop} 
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="form-select"
            >
              <option value="">Выберите культуру</option>
              <option value="wheat">Пшеница</option>
              <option value="corn">Кукуруза</option>
            </select>
            
            <input type="file" id="imageUpload" onChange={handleFileChange} hidden />
            <label htmlFor="imageUpload" className="btn btn-outline">Выбрать фото</label>
            
            {preview && <img src={preview} alt="Preview" className="img-preview" />}
            <button className="btn btn-primary">Запустить анализ</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Analysis;