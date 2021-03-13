import React, { useState } from 'react'
import { Typography, Button, Form, Icon } from 'antd';
import Dropzone from 'react-dropzone';
import Axios from 'axios';
import './GameBuildUpPage';

const {Title} = Typography

function GameBuildUpPage(props) {

  const [filePath, setFilePath] = useState("")


  const onDrop = (files) => {
    if(!files[0]){
      alert('손상된 파일입니다.');
      return;
    }

    let formData = new FormData;
    const config = {
      header: {'content-type': 'multipart/form-data'} //content type을 같이 보내줘야한다!
    }
    formData.append("file", files[0])
      
    Axios.post('/api/game/uploadfiles', formData, config)
    .then(response => {
      if(response.data.success) {
        setFilePath(response.data.url)

      } else {
        alert('업로드 실패')
      }
    })
  }


  return (
    <div style={{ maxWidth:'700px', margin:'2rem auto'}}>
      <div style={{textAlign:'center', marginBottom:'2rem'}}>
        <Title level={2}>Make Game(..사진 추가 구현중)edit해도 상관없습니다.</Title>
      </div>
      <Form>
        <div style={{display:'flex', justifyContent:'space-between'}}>
          {/* drop zone */}
          <Dropzone
            onDrop={onDrop}
            multiple={false}
            maxSize={1000000000}
          >
            {({ getRootProps, getInputProps}) => (
            <div style={{width:'300px', height: '240px',
            border:'1px solid lightgray', display:'flex', alignItems:'center',
          justifyContent:'center'}} {...getRootProps()}>
            <input {...getInputProps()}/>
            <Icon type="plus" style={{fontSize: '3rem'}}/>
          </div>
          )}
          </Dropzone>
          {/* thunb nail */}
          {filePath && 
          <div>
            <img className="video__img" src={`http://localhost:5000/${filePath}`} alt="thumbnail" />
          </div>
          }

        </div>

        <br/>
        <br/>
        <Button type="primary" size="large">
          Finish
        </Button>

      </Form>
    </div>
  )
}

export default GameBuildUpPage
