import React, { useState } from "react";
import { useSelector } from "react-redux";
import BaseURL from '../api/BaseURL'
import Buttons from "../components/Buttons/Buttons";
import Modal from 'react-bootstrap/Modal';
import Placeholder from 'react-bootstrap/Placeholder'

export default function Offer(props) {
    const [status, setStatus] = useState(props.status);
    const [isHeader, setIsHeader] = useState(props.header);
    const Theme = useSelector((state) => state.theme.theme);
    const [isOpen, setIsOpen] = useState(false);

    const togglePopup = () => {
        setIsOpen(!isOpen);
    };

    const positiveHandler = (e) => {
        e.preventDefault()

        fetch(BaseURL + `api/offer/changeStatus?offer=${props.offer_id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + JSON.parse(localStorage.getItem('user')).token,
            },
        }).then((response) => response.json())

        setStatus("true");
        togglePopup();
    };

    const negatiffHandler = (e) => {
        e.preventDefault()

        fetch(BaseURL + `api/offer/changeStatus?offer=${props.offer_id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + JSON.parse(localStorage.getItem('user')).token,
            },
        }).then((response) => response.json())

        setStatus("false");
        togglePopup();
    };

    const deleteHandler = (e) => {
        e.preventDefault()

        fetch(BaseURL + `api/offer/delete?offer=${props.offer_id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + JSON.parse(localStorage.getItem('user')).token,
            },
        }).then((response) => response.json())

        togglePopup();
        window.location.reload();
    }

    const examineFunction = () => {
        fetch(BaseURL + "api/offerMaterial?offer=" + props.offer_id, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + JSON.parse(localStorage.getItem('user')).token,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                props.m(data)
            })
    }

    return (
        <>
            {isHeader ?
                (
                    <div className="d-flex flex-row bg-secondary p-3 ps-5 ps-sm-5 px-sm-4 rounded-pill mb-3">
                        <div className="d-flex align-items-center col-7 text-white">
                            {props.title}
                        </div>
                        <div className="d-md-flex d-none align-items-center col-2 ms-3 text-white">
                            {props.date}
                        </div>
                    </div>
                ) :

                <div className={
                    status ? "d-flex flex-row bg-opacity-75 bg-success text-white p-3 ps-5 rounded-pill mb-3"
                        : !Theme ? "d-flex flex-row bg-opacity-75 bg-danger text-white p-3 ps-5 rounded-pill mb-3" :
                            "d-flex flex-row bg-opacity-50 bg-danger text-white p-3 ps-sm-5 rounded-pill mb-3"
                }
                >
                    <div className="d-flex align-items-center col-7">
                        {props.title === "placeholder" ?
                            <Placeholder as="p" animation="glow">
                                <Placeholder style={{ width: 150 }} size="lg" />
                            </Placeholder>
                            :
                            props.title}
                    </div>

                    <div className="d-none d-md-flex align-items-center col-2 ">
                        {props.date === "placeholder" ?
                            <Placeholder as="p" animation="glow">
                                <Placeholder style={{ width: 150 }} size="lg" />
                            </Placeholder>
                            :
                            props.date
                        }
                    </div>

                    <div className={"d-flex justify-content-evenly col-5 col-md-3"}>
                        {props.date === "placeholder" ?
                            <>
                                <Placeholder.Button xs={3} aria-hidden="true" />
                                <Placeholder.Button xs={3} aria-hidden="true" />
                            </>
                            :
                            <>
                                <Buttons title="İncele" clicked={examineFunction} />
                                <Buttons title="Ayarla" clicked={togglePopup} />
                            </>
                        }
                    </div>
                </div>
            }

            <Modal show={isOpen} onHide={togglePopup} centered>
                <Modal.Header className="bg-opacity-75 bg-primary" closeButton>
                    <Modal.Title className="user-select-none">
                        {props.title}  <span className="h6">{props.date}</span>
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <div className="d-flex flex-column justify-content-center text-product">
                        <button
                            className="btn btn-success"
                            onClick={positiveHandler}
                        >
                            Teklifi olumlu yap
                        </button>
                        <button
                            className="btn btn-success mt-2"
                            onClick={negatiffHandler}
                        >
                            Teklifi olumsuz yap
                        </button>
                        <button
                            className="btn btn-danger mt-2"
                            onClick={deleteHandler}
                        >
                            Sil
                        </button>
                    </div>
                </Modal.Body>
            </Modal>

        </>
    );
}
