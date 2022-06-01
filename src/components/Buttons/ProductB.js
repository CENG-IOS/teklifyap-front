import React, { useState, useEffect, useRef } from "react";
import leftVector from "../../images/leftVector.svg";
import middleVector from "../../images/middleVector.svg";
import rightVector from "../../images/rightVector.svg";
import { useSelector } from "react-redux";
import Modal from 'react-bootstrap/Modal';
import BaseURL from "../../api/BaseURL"
import Placeholder from 'react-bootstrap/Placeholder'
import Form from 'react-bootstrap/Form'

export default function ProductB(props) {

    const [isOpen, setIsOpen] = useState(false);
    const [openRes, setOpenRes] = useState(false);
    const [res, setRes] = useState(false);
    const [mateial_id, setMaterialID] = useState(props.material_id);
    const id = useSelector((state) => state.auth.userID);
    const ppu = useRef(0);

    const togglePopup = () => {
        setIsOpen(!isOpen);
    }

    const deleteMaterial = () => {

        setTimeout(() => setOpenRes(true), 650)

        fetch(BaseURL + "api/material?material=" + mateial_id + "&user=" + localStorage.getItem("userID"), {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("token").substring(1, 177),
            }
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.status === "200 OK") {
                    setRes(true)
                } else {
                    setRes(false)
                }
            });
        togglePopup()
    }

    const updateMaterial = () => {

        setTimeout(() => setOpenRes(true), 650)

        fetch(BaseURL + "api/material?material=" + mateial_id, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("token").substring(1, 177),
            },
            body: JSON.stringify({
                pricePerUnit: ppu.current.value,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.status === "200 OK") {
                    setRes(true)
                } else {
                    setRes(false)
                }
            });
        togglePopup()
    }


    return (
        <>
            <div className="m-3">
                <div onClick={props.catcher} className="btn product-btn d-flex flex-column justify-content-around round" onClick={props.title === "placeholder" ? null : togglePopup}>
                    <div className="d-flex position-relative justify-content-center z-index-fixer">
                        <div className="position-absolute d-flex justify-content-center align-items-center h-100 product-text ">
                            {props.title === "placeholder" ?
                                <Placeholder as="p" animation="glow">
                                    <Placeholder xs={6} style={{ width: 150 }} />
                                </Placeholder>
                                :
                                props.title}
                        </div>
                        <img
                            src={rightVector}
                            className="position-absolute rightV mt-4 "
                            alt='rightVector'
                        ></img>
                        <img src={middleVector} className="middleV"></img>
                        <img
                            src={leftVector}
                            className="position-absolute leftV mt-3"
                            alt='leftVector'
                        ></img>
                    </div>
                </div>
            </div>

            <Modal show={isOpen} onHide={togglePopup} centered size="sm">
                <Modal.Header className="bg-opacity-75 bg-primary user-select-none" closeButton>
                    <Modal.Title> {props.title}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <div className="d-flex flex-column justify-content-center mt-3">
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label><b>ÖLÇÜ BİRİMİ:</b></Form.Label>
                                <Form.Control type="text" disabled defaultValue={props.unit} />
                            </Form.Group>
                        </Form>

                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label><b>BİRİM FİYATI:</b></Form.Label>
                                <Form.Control type="number" min="0" defaultValue={props.price_per_unit} ref={ppu} />
                            </Form.Group>
                        </Form>

                        {props.is_fixed ? <div className="text-center">"Bu silinemez bir malzemedir!"</div> : null}
                    </div>
                </Modal.Body>

                <Modal.Footer className="d-flex justify-content-evenly">
                    <button className="btn btn-success col-4" onClick={updateMaterial}>Kaydet</button>
                    {props.is_fixed ? null :
                        <button className="btn btn-danger col-4" onClick={deleteMaterial}>Sil</button>
                    }

                </Modal.Footer>
            </Modal>

            <Modal show={openRes} backdrop="static" onHide={() => window.location.reload(false)} centered size="sm">
                <Modal.Header className={res ? "bg-opacity-75 bg-success" : "bg-opacity-75 bg-danger"} closeButton >
                    <Modal.Title>{!res ? "Hata" : "Başarılı!"}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {!res ? "Beklenmedik bir hata çıktı!" : "Ürün başarıyla güncellendi!"}
                </Modal.Body>
            </Modal>

        </>

    );

}
