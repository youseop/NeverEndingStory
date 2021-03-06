import * as React from "react";
import * as Yup from 'yup';
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { registerUser } from "../../../_actions/user_actions";
import { Formik } from 'formik';
import { Form, Input } from 'antd';
import "./RegisterPage.css"
import Axios from "axios"

interface RegisterPageProps {
  history: {
    push: Function;
  }
}

interface RegisterUser {
  payload: {
    success: boolean;
    err: {
      errmsg: string;
    }
  }
}

interface FormType {
  email: string;
  nickname: string;
  password: string;
  confirmPassword: string;
}

function RegisterPage(props: RegisterPageProps) {
  const dispatch: any = useDispatch();
  return (
    <Formik
      initialValues={{
        email: '',
        nickname: '',
        password: '',
        confirmPassword: ''
      }}
      validationSchema={Yup.object().shape({
        nickname: Yup.string()
          .max(12,'닉네임은 최대 12글자까지 입력 가능합니다.')
          .required('필수 정보입니다.'),
        email: Yup.string()
          .email('이메일 형식이 아닙니다.')
          .required('필수 정보입니다.'),
        password: Yup.string()
          .min(6, '패스워드는 최소 6글자 이상 입력해주세요.')
          .required('필수 정보입니다.'),
        confirmPassword: Yup.string()
          .oneOf([Yup.ref('password'), undefined], '패스워드가 틀립니다.')
          .required('패스워드를 다시 입력해주세요.')
      })}
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(async () => {
          let emailFlag
          await Axios.post("/api/users/email-check", { email: values.email }).then((response) => {
            emailFlag = response.data.usedEmail
          })

          if (emailFlag) {
            alert("이미 사용 중인 이메일 입니다.")
            setSubmitting(false);
            return
          }
          let nicknameFlag
          await Axios.post("/api/users/nickname-check", { nickname: values.nickname }).then((response) => {
            nicknameFlag = response.data.usedNickname
          })

          if (nicknameFlag) {
            alert("이미 사용 중인 닉네임 입니다.")
            setSubmitting(false);
            return
          }

          let dataToSubmit = {
            email: values.email,
            password: values.password,
            nickname: values.nickname,
            image: "https://i.imgur.com/rF80MBo.png",
            // image: `http://gravatar.com/avatar/${moment().unix()}?d=identicon`
          };

          await dispatch(registerUser(dataToSubmit)).then((response: RegisterUser) => {
            if (response.payload.success) {
              props.history.push("/");
            } else {
              alert(response.payload.err.errmsg)
            }
          })

          setSubmitting(false);
        }, 500);
      }}
    >
      {props => {
        const {
          values,
          touched,
          errors,
          isSubmitting,
          handleChange,
          handleBlur,
          handleSubmit,
        } = props;
        return (
          <div className="registerPage-container">
            <div className="registerDiv-container">
              <div className="register-Title">회원가입</div>
              <div className="register-oldUser">기존 사용자이신가요? <Link className="register-login" to="/login">로그인하기</Link></div>

              <Form onSubmit={handleSubmit} labelAlign="left"
                labelCol={{ span: 5 }} wrapperCol={{ span: 19 }}>

                <Form.Item required label={<label style={{ color: "white" }}> 닉네임</label>}>
                  <Input
                    id="nickname"
                    placeholder="닉네임을 입력하세요"
                    type="text"
                    value={values.nickname}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={
                      errors.nickname && touched.nickname ? 'text-input error' : 'text-input'
                    }
                  />
                  {errors.nickname && touched.nickname && (
                    <div className="input-feedback" style={{ color: "rgb(255, 60, 60)" }}>{errors.nickname}</div>
                  )}
                </Form.Item>

                <Form.Item required label={<label style={{ color: "white" }}> 이메일</label>}
                  hasFeedback validateStatus={errors.email && touched.email ? "error" : 'success'}>
                  <Input
                    id="email"
                    placeholder="이메일을 입력하세요."
                    type="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={
                      errors.email && touched.email ? 'text-input error' : 'text-input'
                    }
                  />
                  {errors.email && touched.email && (
                    <div className="input-feedback" style={{ color: "rgb(255, 60, 60)" }}>{errors.email}</div>
                  )}
                </Form.Item>

                <Form.Item required label={<label style={{ color: "white" }}> 비밀번호</label>}
                  hasFeedback validateStatus={errors.password && touched.password ? "error" : 'success'}>
                  <Input
                    id="password"
                    placeholder="비밀번호를 입력하세요"
                    type="password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={
                      errors.password && touched.password ? 'text-input error' : 'text-input'
                    }
                  />
                  {errors.password && touched.password && (
                    <div className="input-feedback" style={{ color: "rgb(255, 60, 60)" }}>{errors.password}</div>
                  )}
                </Form.Item>

                <Form.Item required label={<label style={{ color: "white" }}> 비밀번호 재확인</label>} hasFeedback>
                  <Input
                    id="confirmPassword"
                    placeholder="비밀번호를 재입력하세요"
                    type="password"
                    value={values.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={
                      errors.confirmPassword && touched.confirmPassword ? 'text-input error' : 'text-input'
                    }
                  />
                  {errors.confirmPassword && touched.confirmPassword && (
                    <div className="input-feedback" style={{ color: "rgb(255, 60, 60)" }}>{errors.confirmPassword}</div>
                  )}
                </Form.Item>

                <Form.Item>
                  <div>
                    <button
                      type="submit"
                      className="register-button"
                      disabled={isSubmitting}
                      onSubmit={() => handleSubmit()}
                    >
                      회원가입
                    </button>
                  </div>
                </Form.Item>

              </Form>
            </div>
          </div>
        );
      }}
    </Formik>
  );
};


export default RegisterPage
