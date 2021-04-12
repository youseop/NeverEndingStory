import * as React from "react";
import * as Yup from 'yup';
import { Link, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { registerUser } from "../../../_actions/user_actions";
import { Formik } from 'formik';
import { Form, Input } from 'antd';
import "./RegisterPage.css"
import Axios from "axios"

interface RegisterPageProps {
    history: {
        push: Function;
        replace:Function;
    }

}

interface LocationState {
    snsId: Number;
    snsProvider: string;
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
    nickname: string;
    snsId: Number;
    snsProvide: string;
}

function PassportRegisterPage(props: RegisterPageProps) {
    const dispatch: any = useDispatch();
    const location = useLocation<LocationState>();
    const { snsId, snsProvider } = location.state;
    return (
        <Formik
            initialValues={{
                nickname: '',
            }}
            validationSchema={Yup.object().shape({
                nickname: Yup.string()
                    .max(15, '닉네임은 최대 15글자까지 입력 가능합니다.')
                    .required('필수 정보입니다.'),
            })}
            onSubmit={(values, { setSubmitting }) => {
                setTimeout(async () => {
                    let flag
                    await Axios.post("/api/users/nickname-check", { nickname: values.nickname }).then((response) => {
                        flag = response.data.usedNickname
                    })

                    if (flag) {
                        alert("이미 사용 중인 닉네임 입니다.")
                        setSubmitting(false);
                        return
                    }

                    let dataToSubmit = {
                        nickname: values.nickname,
                        snsId: snsId,
                        snsProvider: snsProvider,
                        image: "https://i.imgur.com/rF80MBo.png",
                        // image: `http://gravatar.com/avatar/${moment().unix()}?d=identicon`
                    };

                    await dispatch(registerUser(dataToSubmit)).then((response: RegisterUser) => {
                        if (response.payload.success) {
                            props.history.replace("/");
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


export default PassportRegisterPage
