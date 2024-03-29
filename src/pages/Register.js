import React, { useState} from "react";
import background from "../images/bg.jpg";
import Input from "../components/Inputs/Input";
import Buttons from "../components/Buttons/Buttons";
import { useHistory } from "react-router-dom";
import warnIng from "../images/warning.svg";
import { useSelector } from "react-redux";
import Modal from 'react-bootstrap/Modal';
import BaseURL from '../api/BaseURL'
import FakeLoader from "../components/FakeLoader";

const Register = () => {
    const [name, setName] = useState("");
    const [surname, setSurname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordAgain, setPasswordAgain] = useState("");
    const [warningPop, setWarningPop] = useState(false);
    const [warning, setWarning] = useState([]);
    const [myArray, setmyArray] = useState(null);
    const [demo, setDemo] = useState(true);
    let history = useHistory();
    const Theme = useSelector((state) => state.theme.theme);

    /*****************************************************************************/

    const nameHandler = (event) => {
        setName(event.target.value);
    };
    const surnameHandler = (event) => {
        setSurname(event.target.value);
    };
    const emailHandler = (event) => {
        setEmail(event.target.value);
    };
    const passwordHandler = (event) => {
        setPassword(event.target.value);
    };
    const passwordAgainHandler = (event) => {
        setPasswordAgain(event.target.value);
    };
    /*****************************************************************************/

    const delay = ms => new Promise(res => setTimeout(res, ms));

    const RegisterHandler = (event) => {
        setWarning([]);
        event.preventDefault();
        /* getting current date*/
        var today = new Date();
        String(today.getDate()).padStart(2, "0");
        String(today.getMonth() + 1).padStart(2, "0");
        today.getFullYear();
        /*  creationDate: new Date(),*/

        let nameController = /^[a-zA-ZğüşöçİĞÜŞÖÇ1234567890]+$/.test(name);
        let surnameController = /^[a-zA-ZğüşöçİĞÜŞÖÇ1234567890]+$/.test(surname);
        /^\d+$/.test(password);
        const values = {
            name: name,
            surname: surname,
            mail: email,
            password: password
        };

        if (password !== passwordAgain) {
            setWarning((oldArray) => [...oldArray, "Şifreler uyuşmuyor."]);
            return;
        } else if (
            password === password.toLowerCase ||
            password.length < 6 ||
            !/\d/.test(password) ||
            !/[$-/:-?{-~!"^_`\[\]]/.test(password)
        ) {
            setWarning((oldArray) => [
                ...oldArray,
                "Şifre istenen özellikleri sağlamıyor.",
            ]);
            return;
        }
        if (!nameController || !surnameController) {
            setWarning((oldArray) => [...oldArray, "Ad ve soyad tanımlanamıyor."]);
            return;
        }

        if (warning.length < 1)
            setWarningPop(true)

        fetch(BaseURL + "auth", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
        })
            .then((response) => response.json())
            .then(async (data) => {
                console.log(data);
                if (data.status === "200 OK") {
                    setWarningPop(true);

                    await delay(5000);
                    
                    history.push("/login");
                } else if (data.status === 500) {
                    if (data.message === "existingUser") {
                        setWarning((oldArray) => [
                            ...oldArray,
                            "Bu mail adresi zaten kayıtlı."
                        ]);
                    } else {
                        setWarning((oldArray) => [
                            ...oldArray,
                            "Bir hata oluştu."
                        ]);
                    }
                    setWarningPop(false)
                }
            });
    };


    return (
        <React.Fragment>

            <div className="container-fluid position-relative overflow-hidden vh-100 p-0">
                <img alt="alt" className="background-img" src={background}></img>
                <div className="img-cover-color"></div>

                <div className="container mt-5">
                    <div className="d-flex justify-content-center">
                        <div className={!Theme ? "p-5 round round-default-theme" : "p-5 round round-dark-theme"}>
                            <div className="d-flex flex-column flex-lg-row">

                                <div className="col-lg-5">
                                    <form onSubmit={RegisterHandler}>
                                        <div>
                                            <div className="hover-me">
                                                <Input
                                                    title="Ad"
                                                    enteredValue={nameHandler}
                                                    inputValue={name}
                                                    maxlength="10"
                                                ></Input>
                                            </div>

                                        </div>

                                        <div className="mt-3">
                                            <Input
                                                title="Soyad"
                                                enteredValue={surnameHandler}
                                                inputValue={surname}
                                                maxlength="10"
                                            ></Input>
                                        </div>

                                        <div className="mt-3">
                                            <div className="hover-me">
                                                <Input
                                                    title="Email"
                                                    enteredValue={emailHandler}
                                                    inputValue={email}
                                                    maxlength="35"
                                                ></Input>
                                            </div>
                                         
                                        </div>

                                        <div className="mt-3">
                                            <div className="hover-me">
                                                <Input
                                                    title="Şifre"
                                                    enteredValue={passwordHandler}
                                                    inputValue={password}
                                                ></Input>
                                            </div>

                                         
                                        </div>

                                        <div className="mt-3">
                                            <Input
                                                title="Şifrenizi tekrar giriniz"
                                                enteredValue={passwordAgainHandler}
                                                inputValue={passwordAgain}
                                            ></Input>
                                        </div>

                                        {warning.map((index) => (
                                            <div className="col-11 user-select-none mt-3">
                                                <div className="d-flex align-self-start">
                                                    <img alt="alt" className="warning-img d-inline" src={warnIng} />
                                                    <div className="ms-1 warning-text">{index}</div>
                                                </div>
                                            </div>
                                        ))}

                                        <div className="d-flex justify-content-center mt-3 mb-2">
                                            <Buttons
                                                title="Kayıt Ol"
                                                disabled={
                                                    myArray != null
                                                        ? !!myArray.success
                                                        : null
                                                }
                                            ></Buttons>
                                        </div>
                                    </form>
                                </div>

                                <div
                                    className={
                                        !Theme
                                            ? "col-lg-2 mb-2 or-text or-text-default-theme d-flex align-items-center justify-content-center fs-5 user-select-none"
                                            : "col-lg-2 mb-2 or-text or-text-dark-theme d-flex align-items-center justify-content-center fs-5 user-select-none"
                                    }
                                >
                                    veya
                                </div>

                                <div className="col-lg-5">
                                    <div className="d-flex flex-column ">

                                        <div className="hover-me">
                                            <div className="d-flex justify-content-center">
                                                <Buttons
                                                    title="Facebook İle Kayıt Ol"
                                                    disabled={true}
                                                ></Buttons>
                                            </div>
                                        </div>

                                        <div className="mt-2">
                                            <div className="hover-me">
                                                <div className="d-flex justify-content-center">
                                                    <Buttons
                                                        title="Google İle Kayıt Ol"
                                                        disabled={true}
                                                    ></Buttons>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={warningPop} centered backdrop="static" size="sm">
                <Modal.Header className="bg-opacity-75 bg-warning">
                    <Modal.Title className="user-select-none">Kayıt yapılırken bekleyin!</Modal.Title>
                </Modal.Header>

                <Modal.Body className="d-flex justify-content-center">

                    <FakeLoader loadingText="Malzemeler oluşturuluyor">
                        <FakeLoader loadingText="Teklifler oluşturuluyor">
                            <FakeLoader loadingText="Sizin için hazır hale getiriyoruz">
                                <FakeLoader loadingText="Son birkaç adım daha...">
                                    <h3>Yüklendi!</h3>
                                </FakeLoader>
                            </FakeLoader>
                        </FakeLoader>
                    </FakeLoader>

                </Modal.Body>
            </Modal>

            <Modal show={demo} centered backdrop="static" onHide={() => setDemo(false)} >
                <Modal.Header className="bg-opacity-75 bg-warning" closeButton>
                    <Modal.Title className="user-select-none">Kayıt olmadan önce uyarı!</Modal.Title>
                </Modal.Header>

                <Modal.Body className="text-center">
                    Bu proje bir demodur. Bazı özellikleri eksik olabilir. Güvenliğiniz açısından şahsi epostanız,
                    kimlik bilgileriniz ya da sık kullandığınız şifreleri kullanmayınız.
                </Modal.Body>
            </Modal>


        </React.Fragment>


    );

}
export default Register;
