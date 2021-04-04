import React, { useState } from "react";
import { Link, withRouter } from "react-router-dom";
import { loginUser } from "../../../_actions/user_actions";
import { Formik } from "formik";
import * as Yup from "yup";
import { Form, Icon, Input, Button, Checkbox } from "antd";
import { useDispatch } from "react-redux";
import "./LoginPage.css";
import KakaoLogin from "react-kakao-login"
import Axios from "axios";
const config = require("../../../config/key")
interface LoginPageProps {
  history: {
    replace: Function;
  }
}

interface LoginUser {
  payload: {
    loginSuccess: boolean;
    userId?: string | undefined;
    message?: string;
  }
  type: string;
}

function LoginPage(props: LoginPageProps) {
  const dispatch: any = useDispatch();
  const rememberMeChecked = localStorage.getItem("rememberMe") ? true : false;
  const [formErrorMessage, setFormErrorMessage] = useState("");
  const [rememberMe, setRememberMe] = useState(rememberMeChecked);

  const handleRememberMe = () => {
    setRememberMe(!rememberMe);
  };

  const initialEmail = localStorage.getItem("rememberMe")
    ? localStorage.getItem("rememberMe")!
    : undefined;

  const kakaoLogin = (login: any) => {
    Axios.post('/api/passport/kakao/oauth', { profile: login.profile })
      .then((res: any) => {
        if (res.data.success) {
          if (res.data.newUser) {
            props.history.replace({
              pathname: `/passport/register`,
              state: {
                snsId: login.profile.id,
                snsProvider: "kakao",
              }
            })
          }
          else {
            props.history.replace("/");
          }
        }
      })

  }
  const fail = () =>{
    props.history.replace({
      pathname:`/login`
    })
  }

  return (
    <Formik
      initialValues={{
        email: initialEmail,
        password: "",
      }}
      validationSchema={Yup.object().shape({
        email: Yup.string()
          .email("이메일 주소를 입력해 주세요.")
          .required("이메일 주소를 입력해 주세요."),
        password: Yup.string()
          .min(6, "비밀번호는 최소 6글자 이상이어야 합니다.")
          .required("비밀번호를 입력해 주세요."),
      })}
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {
          let dataToSubmit = {
            email: values.email,
            password: values.password,
          };

          dispatch(loginUser(dataToSubmit))
            .then((response: LoginUser) => {
              if (response.payload.loginSuccess) {
                if (rememberMe === true && values.email) {
                  window.localStorage.setItem("rememberMe", values.email);
                } else {
                  localStorage.removeItem("rememberMe");
                }
                props.history.replace("/");
              } else {
                setFormErrorMessage("아이디와 비밀번호를 확인해 주세요.");
              }
            })
            .catch((err: boolean) => {
              setFormErrorMessage("아이디와 비밀번호를 확인해 주세요.");
              setTimeout(() => {
                setFormErrorMessage("");
              }, 3000);
            });


          setSubmitting(false);
        }, 500);
      }}
    >
      {(props) => {
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
          <div className="loginPage-container">
            <div className="loginDiv-container">
              <div className="login-Title">로그인</div>
              <div className="login-newUser">신규 사용자이신가요? <Link className="login-register" to="/register">계정만들기</Link></div>
              <form onSubmit={handleSubmit} style={{ width: "600px" }}>
                <Form.Item required>
                  <Input
                    id="email"
                    prefix={
                      <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
                    }
                    placeholder="이메일 주소"
                    type="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={
                      errors.email && touched.email
                        ? "text-input error"
                        : "text-input"
                    }
                  />
                  {errors.email && touched.email && (
                    <div className="input-feedback" style={{ color: "rgb(255, 60, 60)" }}>{errors.email}</div>
                  )}
                </Form.Item>

                <Form.Item required>
                  <Input
                    id="password"
                    prefix={
                      <Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />
                    }
                    placeholder="비밀번호"
                    type="password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={
                      errors.password && touched.password
                        ? "text-input error"
                        : "text-input"
                    }
                  />
                  {errors.password && touched.password && (
                    <div className="input-feedback" style={{ color: "rgb(255, 60, 60)" }}>{errors.password}</div>
                  )}
                </Form.Item>

                {formErrorMessage && (
                  <label>
                    <p className="login-error">
                      {formErrorMessage}
                    </p>
                  </label>
                )}

                <Form.Item>
                  <Checkbox
                    className="rememberMe"
                    onChange={handleRememberMe}
                    checked={rememberMe}
                    style={{ color: "white" }}
                  >
                    아이디 기억하기
                  </Checkbox>
                  {/* <a
                    className="login-form-forgot"
                    href="/reset_user"
                    style={{ float: "right" }}
                  >
                    forgot password
                  </a> */}
                  <Form.Item>
                    <div>
                      <button
                        type="submit"
                        className="login-button"
                        disabled={isSubmitting}
                        onSubmit={() => handleSubmit()}
                      >
                        로그인
                    </button>
                      <KakaoLogin
                        token={config.KAKAO_KEY}
                        onSuccess={(login) => { handleSubmit(); return kakaoLogin(login) }}
                        onFail={()=>{fail()}}
                        className="login-button login-kakao">
                        카카오 로그인

                    </KakaoLogin>

                  </div>
                  </Form.Item>

                </Form.Item>
              </form>
            </div>
          </div>
        );
      }}
    </Formik>
  );
}

export default withRouter(LoginPage);
