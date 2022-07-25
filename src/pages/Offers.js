import React, { useEffect, useState } from "react";
import Offer from "../components/Offer";
import Footer from "../components/Footer";
import BaseURL from '../api/BaseURL'
import Modal from 'react-bootstrap/Modal';
import Waves from "../components/Waves";

export default function Offers() {

    const [offersInfo, setOffersInfo] = useState([]);
    const [examine, setExamine] = useState(false);
    const [data, setData] = useState({});
    const [isEmpty, setIsEmpty] = useState(false);
    const [loading, setLoading] = useState(true);

    const toggleExamine = () => {
        setExamine(!examine)
    }

    function getTableDatas(data) {
        console.log(data);
        setData(data)
        toggleExamine()
    }

    let formatter = new Intl.NumberFormat('tr', {
        style: 'currency',
        currency: 'TRY',
    });

    function downloadHandler() {
        fetch(BaseURL + 'api/offer/download?offer=' + data.id, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/pdf',
                "Authorization": "Bearer " + localStorage.getItem("token")
            }
        }).then(res => {
            if (res.ok) {
                res.blob().then(blob => {
                    let url = window.URL.createObjectURL(blob);
                    let a = document.createElement('a');
                    a.href = url;
                    a.download = data.offer_name;
                    a.click();
                })
            }
        })

    }

    useEffect(() => {
        setTimeout(() => {
            fetch(BaseURL + `api/offer/getOffers?user=` + localStorage.getItem("userID"), {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("token")
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    setLoading(false)
                    if (data.length === 0)
                        setIsEmpty(true)
                    else
                        setOffersInfo(data)
                });
        }, 600);

    }, []);

    return (
        <>
            <div className="container-fluid p-0 position-relative">

                <div className="positive-relative">
                    <div className="inventory-img-top-section"></div>

                    <Waves />

                    <div className="d-flex justify-content-center">
                        <div className=" top-0 h3 user-select-none">
                            TEKLİFLERİM
                        </div>
                    </div>

                    <div className="container offers-section">
                        <Offer title="Teklif Başlığı" date="Tarih" header="true" />
                        {offersInfo.map((item) =>
                            <Offer
                                m={getTableDatas}
                                key={item.id}
                                offer_id={item.id}
                                title={item.title}
                                date={item.date}
                                status={item.status}
                            />
                        )}
                        {loading &&
                            <Offer
                                m={getTableDatas}
                                key="placeholder"
                                offer_id="placeholder"
                                title="placeholder"
                                date="placeholder"
                                status="placeholder"
                            />}

                        {isEmpty &&
                            <div className="text-center bg-warning p-3 rounded-pill user-select-none font-weight-bold">
                                Görünüşe göre gösterilecek bir teklifiniz yok. Teklif yapmak için sağ üstteki tuşa basınız!
                            </div>
                        }

                    </div>
                </div>

            </div>

            <Footer />

            <Modal show={examine} onHide={toggleExamine} centered size="lg">
                <Modal.Header className={data && data.status ? "bg-succes" : "bg-danger" + " bg-opacity-75"} closeButton>
                    <Modal.Title className="user-select-none">
                        {data.title} <span className="h6">{data.date} </span>
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <table className="table table-bordered">
                        <thead className="table-dark">
                            <tr>
                                <th className="text-center">#</th>
                                <th>Malzemenin İsmi</th>
                                {/* <th>Birim Fiyatı</th> */}
                                <th>Ölçü Birimi</th>
                                {/* <th>Birim Miktarı</th> */}
                                <th>Tutar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.materials && data.materials.map((item, index) =>
                                <tr key={index}>
                                    <td className="text-center"> {index + 1} </td>
                                    <td>{item.material.name}</td>
                                    <td>{item.material.unit}</td>
                                    <td>{item.price} </td>
                                </tr>
                            )}
                        </tbody>
                    </table>


                    <div className="d-flex flex-row">
                        <div className="d-flex justify-content-end col-8 col-md-7 col-lg-8 col-xl-9"><b>Ara Toplam : </b></div>
                        <div className="d-flex justify-content-end col-4 col-md-5 col-lg-4 col-xl-3">{data && formatter.format(data.price).replace('₺', " ") + " ₺"}</div>
                    </div>

                    <div className="d-flex flex-row">
                        <div className="d-flex justify-content-end col-8 col-md-7 col-lg-8 col-xl-9"><b>KDV Tutarı : </b></div>
                        <div className="d-flex justify-content-end col-4 col-md-5 col-lg-4 col-xl-3">{data && formatter.format(data.kdv).replace('₺', " ") + " ₺"}</div>
                    </div>

                    <div className="d-flex flex-row">
                        <div className="d-flex justify-content-end col-8 col-md-7 col-lg-8 col-xl-9"><b>SGK Stopaj : </b></div>
                        <div className="d-flex justify-content-end col-4 col-md-5 col-lg-4 col-xl-3">{data && formatter.format(data.sgk).replace('₺', " ") + " ₺"}</div>
                    </div>

                    <div className="d-flex flex-row">
                        <div className="d-flex justify-content-end col-8 col-md-7 col-lg-8 col-xl-9"><span className="h5 fw-bold">GENEL TOPLAM :</span></div>
                        <div className="d-flex justify-content-end col-4 col-md-5 col-lg-4 col-xl-3"><span className="h5 fw-bold">{data && formatter.format(data.totalPrice).replace('₺', " ") + " ₺"}</span></div>
                    </div>

                    <div className="d-flex justify-content-end me-2 mt-2">
                        <button className="btn btn-success" onClick={downloadHandler}>İndir</button>
                    </div>

                </Modal.Body>
            </Modal>
        </>
    );
}