import React, { useState } from 'react';
import axios from 'axios';
function App() {
  /** start states */
  const [formData, setFormData] = useState('');
  const [info, setInfo] = useState({
    image: '',
    name: '',
  });
  const [progressPercent, setProgressPercent] = useState(0);
  const [error, setError] = useState({
    found: false,
    message: '',
  });
  /** end states */

  // Upload image
  const upload = ({ target: { files } }) => {
    let data = new FormData();
    data.append('categoryImage', files[0]);
    data.append('name', files[0].name);
    setFormData(data);
  };

  // Submit Form
  const handleSubmit = (e) => {
    e.preventDefault();
    setInfo({
      image: '',
      name: '',
    });
    setProgressPercent(0);
    const options = {
      onUploadProgress: (progressEvent) => {
        const { loaded, total } = progressEvent;
        let percent = Math.floor((loaded * 100) / total);
        console.log(`${loaded}kb of ${total}kb | ${percent}%`);
        setProgressPercent(percent);
      },
    };
    axios
      .post('http://localhost:8000/api/category', formData, options)
      .then((res) => {
        console.log(res.data);
        setTimeout(() => {
          setInfo(res.data.category);
          setProgressPercent(0);
        }, 1000);
      })
      .catch((err) => {
        console.log(err.response);
        setError({
          found: true,
          message: err.response.data.errors,
        });
        setTimeout(() => {
          setError({
            found: false,
            message: '',
          });
          setProgressPercent(0);
        }, 3000);
      });
    
  };

  return (
    <div
      style={{ width: '100vw', height: '100vh' }}
      className='d-flex justify-content-center align-items-center flex-column'
    >
      {error.found && (
        <div
          className='alert alert-danger'
          role='alert'
          style={{ width: '359px' }}
        >
          {error.message}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ width: '359px' }}>
        <div className='progress mb-3 w-100'>
          <div
            className='progress-bar'
            role='progressbar'
            style={{ width: `${progressPercent}%` }}
            aria-valuenow={progressPercent}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            {progressPercent}
          </div>
        </div>
        <div className='custom-file mb-3'>
          <input
            type='file'
            className='custom-file-input'
            id='inputGroupFile04'
            aria-describedby='inputGroupFileAddon04'
            onChange={upload}
          />
          <label className='custom-file-label' htmlFor='inputGroupFile04'>
            Choose file
          </label>
        </div>
        <button type='submit' className='btn btn-primary w-100'>
          Submit
        </button>
      </form>
      <img
        className='mt-3'
        src={`http://localhost:8000/${info.image}`}
        alt={`${info.name}`}
        style={{ width: '359px' }}
      />
    </div>
  );
}

export default App;
