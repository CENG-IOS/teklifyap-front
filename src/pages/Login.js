import React, {useState} from "react";
import background from "../images/bg.jpg";
import Buttons from "../components/Buttons/Buttons";
import Input from "../components/Inputs/Input";
import {Link, useHistory} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {AuthActions} from "../store/slices/Auth";
import warnIng from "../images/warning.svg";
import Modal from 'react-bootstrap/Modal'
import BaseURL from '../api/BaseURL'
import FakeLoader from "../components/FakeLoader";

const Login = () => {
        const [email, setEmail] = useState("");
        const [password, setPassword] = useState("");
        const [warning, setWarning] = useState(false);
        const [info, setInfo] = useState({});
        const Theme = useSelector((state) => state.theme.theme);
        const dispatch = useDispatch();
        const history = useHistory();

        dispatch(AuthActions.logout());

        const emailHandler = (e) => {
            setEmail(e.target.value);
        };
        const passwordHandler = (e) => {
            setPassword(e.target.value);
        };

        const loginHandler = (e) => {
            e.preventDefault();

            const values = {
                mail: email,
                password: password,
                rememberMe: true
            };

            fetch(BaseURL + "auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            })
                .then((response) => response.json())
                .then((data) => {
                        if (data.status === "200") {

                            const user = {
                                token: data.token,
                                userID: data.userID,
                            };

                            dispatch(AuthActions.login(user));
                            setTimeout(() => {
                                history.push("/");
                            }, 1000);

                        } else if (data.status === "401 Unauthorized") {
                            setWarning(true);
                        } else if (data.status === "500") {
                            if (data.error === "BadCredentials") {
                                setWarning(true);
                            }
                        }
                    }
                )
            ;
        };

        return (
            <React.Fragment>

                <div className="container-fluid position-relative overflow-hidden vh-100 p-0">
                    <img className="background-img" src={background} alt="bg-image"></img>
                    <div className="img-cover-color"></div>

                    <div className="container mt-5">
                        <div className="d-flex justify-content-center">
                            <div className="col-10 col-sm-9 col-md-7 col-lg-5 col-xl-4">
                                <div
                                    className={
                                        !Theme
                                            ? "d-flex justify-content-center flex-column align-items-center round round-default-theme"
                                            : "d-flex justify-content-center flex-column align-items-center round round-dark-theme"
                                    }
                                >
                                    <form
                                        onSubmit={loginHandler}
                                        className="d-flex flex-column align-items-center mt-4"
                                    >
                                        <h3 className="text-center">Giriş Yap</h3>

                                        <div className="mt-3">
                                            <Input
                                                title="Email"
                                                enteredValue={emailHandler}
                                                inputValue={email}
                                            />
                                        </div>

                                        <div className="mt-3">
                                            <Input
                                                title="Şifre"
                                                enteredValue={passwordHandler}
                                                inputValue={password}
                                            />
                                        </div>

                                        <div className="align-self-end">
                                            <Link
                                                to="./PasswordP"
                                                className={
                                                    !Theme
                                                        ? "mx-3 password-remember-link password-remember-link-default-theme user-select-none"
                                                        : "mx-3 password-remember-link password-remember-link-dark-theme user-select-none"
                                                }
                                            >
                                                Şifremi unuttum
                                            </Link>
                                        </div>

                                        <div className="d-flex align-self-start ms-3 checkbox">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id="remember"
                                                name="remember"
                                            />
                                            <label
                                                className={
                                                    !Theme
                                                        ? "form-check-label ms-2 user-select-none check-default-theme"
                                                        : "form-check-label ms-2 user-select-none check-dark-theme"
                                                }
                                                htmlFor="remember"
                                            >
                                                Beni Hatırla
                                            </label>
                                        </div>

                                        {info.success === false && (
                                            <div className="col-11 user-select-none">
                                                <div className="d-flex align-self-start">
                                                    <img className="warning-img d-inline" src={warnIng} alt="alt"/>
                                                    <div className="ms-1 warning-text">
                                                        Email veya şifre yanlış
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        <div className="mt-3 w-100">
                                            <Buttons title="Giriş Yap" disabled={!!info.success}/>
                                        </div>

                                    </form>

                                    <div
                                        className={
                                            !Theme
                                                ? "text-center mt-3 or-text or-text-default-theme user-select-none account-none-text"
                                                : "text-center mt-3 or-text or-text-dark-theme user-select-none account-none-text"
                                        }
                                    >
                                        Hesabın yoksa
                                        <span> </span>
                                        <Link
                                            className="register-account-link user-select-none mt-2"
                                            to="./Register"
                                        >kayıt ol
                                        </Link>.
                                    </div>
                                    <br/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Modal show={warning} centered backdrop="static" size="sm">
                    <Modal.Header className="bg-opacity-75 bg-warning">
                        <Modal.Title className="user-select-none">
                            Giriş yapılırken bekleyin!
                        </Modal.Title>
                    </Modal.Header>

                    <Modal.Body className="d-flex justify-content-center">
                        <FakeLoader loadingText="Malzemeler getiriliyor">
                            <FakeLoader loadingText="Teklifler getiriliyor">
                                <FakeLoader loadingText="Sizin için hazır hale getiriyoruz">
                                    <FakeLoader loadingText="Son birkaç adım daha...">
                                        <h3>Yüklendi!</h3>
                                    </FakeLoader>
                                </FakeLoader>
                            </FakeLoader>
                        </FakeLoader>
                    </Modal.Body>
                </Modal>
            </React.Fragment>
        );
    }
;

export default Login;
