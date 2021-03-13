import React, { useState } from 'react'
import { Typography, Button, Form, message, Input, Icon } from 'antd';
import Dropzone from 'react-dropzone';
import Axios from 'axios';
import { useSelector } from 'react-redux';
import './GameUploadPage.css';

const {TextArea} = Input
const {Title} = Typography

const PrivateOptions = [
  { value: 0, label: "Private"},
  { value: 1, label: "Public"}
]

const CategoryOptions = [
  {value: 0, label: "Film & Animation"},
  {value: 1, label: "Autos & Vehicles"},
  {value: 2, label: "Music"},
  {value: 3, label: "Pets & Animals"},
]

function GameUploadPage(props) {
  const user = useSelector(state => state.user);
  const [videoTitle, setVideoTitle] = useState("")
  const [description, setDescription] = useState("")
  const [isPrivate, setIsPrivate] = useState(0)
  const [category, setCategory] = useState("Film & Animation")

  const [filePath, setFilePath] = useState("")
  // const [duration, setDuration] = useState("")
  // const [thumbnailPath, setThumbnailPath] = useState("")

  const onTitleChange = (event) => {
    setVideoTitle(event.currentTarget.value)
  }

  const onDescriptionChange = (event) => {
    setDescription(event.currentTarget.value)
  }

  const onPrivateChange = (event) => {
    setIsPrivate(event.currentTarget.value)
  }

  const onCartegoryChange = (event) => {
    setCategory(event.currentTarget.value)
  }

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
        // console.log(response.data);
        // let variable = {
        //   url: response.data.url,
        //   fileName: response.data.fileName
        // }
        setFilePath(response.data.url)

      } else {
        alert('업로드 실패')
      }
    })
  }

  const onSubmit = (event) => {
    event.preventDefault();
    if(videoTitle==="" || description==="" || filePath===""){
      alert("모든 정보를 입력해주세요.");
      return
    }
    const variables = {
      game_creater: user.userData._id,
      game_title: videoTitle,
      game_detail: description,
      game_thumbnail: filePath,
      game_privacy: isPrivate,
      game_category: category,
      game_writer: [],
      game_character: [],
      game_background: [],
    }

    Axios.post('/api/game/uploadgame', variables)
    .then(response => {
      if(response.data.success) {
        message.success('첫 Scene을 생성해주세요. 오른쪽의 +버튼을 활용해 이미지들을 추가할 수 있습니다.');

        setTimeout(() => {
          props.history.push('/game/upload2');
        },2000);
      } else {
        alert('업로드 실패')
      }
    })
  }

  return (
    <div style={{ maxWidth:'700px', margin:'2rem auto'}}>
      <div style={{textAlign:'center', marginBottom:'2rem'}}>
        <Title level={2}>Upload Video</Title>
      </div>
      <Form onSubmit={onSubmit}>
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
        <label>Title</label>
        <Input 
          onChange={onTitleChange}
          value={videoTitle}
        />
        <br/>
        <br/>
        <label>Description</label>
        <TextArea 
          onChange={onDescriptionChange}
          value={description}
        />
        <br/>
        <br/>
        <select onChange={onPrivateChange}>
          {PrivateOptions.map((item, index) => (
            <option key={index} value={item.value}>{item.label}</option>
          ))}
        </select>
        <br/>
        <br/>
        <select onChange={onCartegoryChange}>
          {CategoryOptions.map((item, index) => (
            <option key={index} value={item.value}>{item.label}</option>
          ))}
        </select>
        <br/>
        <br/>
        <Button type="primary" size="large" onClick={onSubmit}>
          Next Step
        </Button>

      </Form>
    </div>
  )
}

export default GameUploadPage
