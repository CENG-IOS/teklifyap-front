import React, { useState, useEffect } from "react";
import ProductB from "../components/Buttons/ProductB";
import Footer from "../components/Footer";
import Modal from 'react-bootstrap/Modal';
import BaseURL from '../api/BaseURL'
import Waves from "../components/Waves";

export default function Inventory() {
    const [myArray, setmyArray] = useState([]);
    const [show, setShow] = useState(false);
    const [isOpen, setIsopen] = useState(false);
    const [isEmpty, setIsEmpty] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: "auto",
        });
    }, []);

    useEffect(() => {

        setTimeout(() => {



            fetch(BaseURL + "api/material/getMaterialByUser" + "?user=" + JSON.parse(localStorage.getItem('user')).userID, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + JSON.parse(localStorage.getItem('user')).token,

                }
            })
                .then((response) => response.json())
                .then((data) => {
                    setLoading(true)
                    if (data.length === 0)
                        setIsEmpty(true)
                    else {
                        setmyArray(data)

                    }
                });

        }, 600);

    }, []);


    function addProductHandler() {
        let productName = document.getElementById("product-name").value;
        let unit = document.getElementById("unit").value;

        const material = {
            name: productName,
            unit: unit,
            pricePerUnit: 0
        }

        fetch(BaseURL + "api/material?user=" + localStorage.getItem("userID"), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("token"),
            },
            body: JSON.stringify(material),
        })
            .then((response) => response.json())
            .then((data) => {
                material.id = data.account;
                setIsopen(true)
            });

        myArray.push(material)
        setmyArray(myArray)

        handleClose()
        // window.location.reload()
    }

    return (
        <>
            <div className="container-fluid p-0 position-relative">

                <div className="positive-relative">
                    <div className="inventory-img-top-section"></div>

                    <Waves />

                    <div className="d-flex justify-content-center ">
                        <div className="position-absolute top-0 h3 user-select-none pt-5">
                            ENVANTERİM
                        </div>
                    </div>

                    <div className="container products-section ">

                        <div className="col-12 p-2 px-5 search-bar round-corner">
                            <div className="d-flex flex-row">

                                <div className="col-2 add-product">
                                    <div className="d-flex justify-content-center align-items-center">
                                        <label className="col-form-label user-select-none fw-bold" htmlFor="filtre">FİLTRE :</label>
                                    </div>
                                </div>

                                <div className="mx-0 mx-sm-0 mx-md-5 mx-lg-0 mx-xl-0 col-10 col-md-8">
                                    <div className="d-flex">
                                        <div className="col-11">
                                            <input className="form-control" onClick={() => alert("şimdilik çalışmıyor!")} id="filtre" name="filtre" type="text" />
                                        </div>
                                    </div>
                                </div>

                                <div className="col-2">
                                    <div className="d-flex justify-content-start">
                                        <button className="btn btn-primary" onClick={handleShow} >
                                            <div className="d-flex flex-row">
                                                <div className="plus" >
                                                    <i className="bi bi-plus-lg"></i>
                                                </div>
                                                <div className="add-product" >
                                                    Malzeme Ekle
                                                </div>
                                            </div>
                                        </button>
                                    </div>
                                </div>

                            </div>
                        </div>

                        <div className="d-flex justify-content-center ">
                            <div className={isEmpty ? "w-100" : "d-flex flex-row flex-wrap justify-content-around"}>
                                {loading ?
                                    myArray.map((index) =>
                                        <ProductB
                                            material_id={index.id}
                                            key={index.id}
                                            title={index.name}
                                            unit={index.unit}
                                            is_fixed={index.fixed}
                                            price_per_unit={index.pricePerUnit}
                                        />
                                    ) :
                                    <ProductB
                                        material_id="placeholder"
                                        key="placeholder"
                                        title="placeholder"
                                        unit="placeholder"
                                    />
                                }

                                {isEmpty &&
                                    <div className="text-center bg-warning p-3 mt-3 rounded-pill user-select-none font-weight-bold">
                                        "Görünüşe göre envanter boş. Malzeme eklemek için tuşa bas!"
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header className="bg-opacity-75 bg-secondary" closeButton>
                    <Modal.Title>Yeni Malzeme</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="d-flex justify-content-around mb-3">
                        <label className="col-5 user-select-none col-form-label me-3" htmlFor="product-name">MALZEME ADI:</label>
                        <input className="form-control" type="text" id="product-name" name="product-name" />
                    </div>

                    <div className="d-flex justify-content-around mb-3">
                        <label className="col-5 user-select-none col-form-label me-3" htmlFor="unit">ÖLÇÜ BİRİMİ:</label>
                        <select className="form-control" name="unit" id="unit">
                            <option value="-">-</option>
                            <option value="M2">M2</option>
                            <option value="M3">M3</option>
                            <option value="TON">TON</option>
                            <option value="ADET">ADET</option>
                        </select>
                    </div>
                </Modal.Body>

                <Modal.Footer>
                    <button className="btn btn-success" variant="primary" onClick={addProductHandler}>
                        Ekle
                    </button>
                </Modal.Footer>
            </Modal>

            <Modal show={isOpen} onHide={() => { setIsopen(false) }} centered size="sm">
                <Modal.Header className="bg-opacity-75 bg-success" closeButton>
                    <Modal.Title>Başarılı!</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    Ürün başarıyla eklendi.
                </Modal.Body>
            </Modal>

            <Footer />
        </>
    );
}
