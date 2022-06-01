import React, { useEffect, useState } from 'react'
import { useSelector } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, {
    Mousewheel, Pagination
} from 'swiper';
import { useHistory } from "react-router-dom";
import Modal from 'react-bootstrap/Modal';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import BaseURL from '../api/BaseURL'

SwiperCore.use([Mousewheel, Pagination]);

export default function MakeOffer(props) {
    const [realData, setRealData] = useState([]);
    const [nameCheckBox, setNameCheckBox] = useState(true)
    const [errorSlide1, setErrorSlide1] = useState(false)
    const [errorSlide2, setErrorSlide2] = useState(false)
    const [errorSlide3, setErrorSlide3] = useState(false)
    const [btnEdit, setBtnEdit] = useState(false)
    const [name, setName] = useState("")
    const [selectedTitle, setSelectedTitle] = useState()
    const [selectedCompanyName, setSelectedCompanyName] = useState()
    const [selectedProfitRate, setSelectedProfitRate] = useState(0)
    const [selectedDate, setSelectedDate] = useState()
    const [selectedUserName, setSelectedUserName] = useState()
    const [selectedRowID, setSelectedRowID] = useState(-1)
    const [selectedMaterials, setSelectedMaterials] = useState([])
    const [selectedDays, setSelectedDays] = useState(0);
    const [offerMaterials, setOfferMaterials] = useState([])
    // const [selectedRow, setSelectedRow] = useState()
    const [warning, setWarning] = useState(false)
    const [totalPrice, setTotalPrice] = useState(0)
    const [kdvPrice, setKDVPrice] = useState(0)
    const [SGKPrice, setSGKPrice] = useState(0)
    const id = useSelector((state) => state.auth.userID);
    const history = useHistory();
    const [my_swiper, set_my_swiper] = useState({});

    var formatter = new Intl.NumberFormat('tr', {
        style: 'currency',
        currency: 'TRY',
    });

    const handleClose = () => {
        if (errorSlide1)
            setErrorSlide1(false)
        else if (errorSlide2)
            setErrorSlide2(false)
        else if (errorSlide3)
            setErrorSlide3(false)
        else {
            setWarning(false)
            history.push("/")
        }
    }

    useEffect(() => {

        fetch(BaseURL + `api/user/getFullName?user=` + localStorage.getItem("userID"), {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("token").substring(1, 177),
            },
        })
            .then((response) => response.json())
            .then((data) => {
                setName(data.account)
            });

        document.getElementById('custom-date').valueAsDate = new Date();
    }, []);

    function nameHandler() {
        setNameCheckBox(!nameCheckBox)
    }

    function fetchForSlide2() {
        fetch(BaseURL + "api/material/getMaterialByUser?user=" + localStorage.getItem("userID"), {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("token").substring(1, 177),
            }
        })
            .then((response) => response.json())
            .then((data) => {
                const temp = new Array()
                for (let i = 0; i < data.length; i++) {
                    temp.push({
                        material_id: data[i].id,
                        material_name: data[i].name,
                        material_unit: data[i].unit,
                        material_price_per_unit: data[i].pricePerUnit, //birim fiyatı
                        material_unit_quantity: 0,                     //birim miktarı
                        is_fixed: data[i].fixed
                    })
                }
                setRealData(temp)
            });

    }

    function updateTable() {
        realData[selectedRowID].material_price_per_unit = document.getElementById("price_per_unit").value
        realData[selectedRowID].material_unit_quantity = document.getElementById("unit_quantity").value
        if (realData[selectedRowID].is_fixed) {
            document.getElementById("fixed").innerHTML = document.getElementById("price_per_unit").value
        }

        document.getElementsByClassName("checkboxs")[selectedRowID].checked = true
        setBtnEdit(false)

        fetch(BaseURL + "api/material?material=" + realData[selectedRowID].material_id, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("token").substring(1, 177),
            },
            body: JSON.stringify({
                pricePerUnit: realData[selectedRowID].material_price_per_unit,

            }),
        })
            .then((response) => response.json())
            .then((data) => {

            });



    }

    function nextSlide(e) {
        my_swiper.slideNext()
    }

    function prevSlide(e) {
        e.preventDefault()
        my_swiper.slidePrev()
    }

    function checkSlide1() {
        let inputs = new Array();

        let offer_title = document.getElementById("offer-title")
        let company_name = document.getElementById("company-name")
        let date = document.getElementById("custom-date")
        let profit_rate = document.getElementById("profit-rate")
        let name = document.getElementById("name")
        let day = document.getElementById("day")

        inputs.push(offer_title)
        inputs.push(company_name)
        inputs.push(date)
        inputs.push(name)
        inputs.push(profit_rate)
        inputs.push(day)

        let flag = true;

        inputs.forEach(element => {
            if (element.value == "") {
                flag = false
            }
        });

        if (flag) {
            setSelectedDate(date.value)
            setSelectedTitle(offer_title.value)
            setSelectedCompanyName(company_name.value)
            setSelectedProfitRate(profit_rate.value)
            setSelectedUserName(name.value)
            setSelectedDays(day.value)
        }

        return flag;
    }

    function checkSlide2() {
        let checkboxs = document.getElementsByClassName("checkboxs")
        const checked = []

        for (let i = 0; i < checkboxs.length; i++) {
            const item = checkboxs[i];
            if (item.checked)
                checked.push(item)
        }
        if (checked.length == 0) {
            setErrorSlide2(true)
            return false
        }
        else {
            const selectedMaterials = []
            const offerMaterials = []

            for (let i = 0; i < checked.length; i++) {
                const element = checked[i];
                if (element.parentElement.nextElementSibling.nextElementSibling.textContent == 0 ||
                    element.parentElement.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.textContent == 0) {
                    setErrorSlide3(true)
                    return false
                }
                if (element.parentElement.nextElementSibling.nextElementSibling.id === "fixed") {
                    setSGKPrice(document.getElementById("fixed").textContent)
                    continue;
                }
                selectedMaterials.push({
                    material: {
                        material_id: element.parentElement.parentElement.id,
                        material_name: element.parentElement.nextElementSibling.textContent,
                        material_is_verified: 1,
                        material_unit: element.parentElement.nextElementSibling.nextElementSibling.nextElementSibling.textContent
                    },
                    offer: {
                        offer_id: "-1"
                    },
                    offer_material_price_per_unit: element.parentElement.nextElementSibling.nextElementSibling.textContent.trim(),
                    offer_material_unit_quantity: element.parentElement.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.textContent.trim(),
                    offer_material_cost: Math.floor(~~(element.parentElement.nextElementSibling.nextElementSibling.textContent.trim()) * ~~(element.parentElement.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.textContent.trim()) * ((~~(selectedProfitRate) + 100) / 100))
                })
                offerMaterials.push({
                    id: element.parentElement.parentElement.id,
                    unitPrice: element.parentElement.nextElementSibling.nextElementSibling.nextElementSibling.nextElementSibling.textContent.trim()
                })
            }
            let temp = 0
            selectedMaterials.forEach(item => {
                temp += item.offer_material_cost
            })
            if (temp === 0) {
                setErrorSlide2(true)
                return false
            }
            setKDVPrice(((temp * 18) / 100))
            setTotalPrice(temp)
            setSelectedMaterials(selectedMaterials)
            setOfferMaterials(offerMaterials)
            return true
        }
    }

    function checkHandler(event, is_fixed) {
        if (is_fixed) {
            event.target.checked = true
        }
    }


    function makeOffer() {

        let offer_materials = []

        for (let i = 0; i < selectedMaterials.length; i++) {
            const element = selectedMaterials[i];
            offer_materials.push({
                id: element.material.material_id,
                unitQuantity: element.offer_material_unit_quantity
            })

        }

        let body = {
            title: selectedTitle,
            toWho: selectedCompanyName,
            totalPrice: kdvPrice + totalPrice + ~~SGKPrice,
            date: selectedDate,
            profitRate: selectedProfitRate,
            userName: selectedUserName,
            day: selectedDays,
            sgk: ~~SGKPrice,
            materials: offer_materials
        }

        fetch(BaseURL + "api/offer?user=" + localStorage.getItem("userID"), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("token").substring(1, 177)
            },
            body: JSON.stringify(body)
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.status === "200 OK") {
                    setWarning(true)
                } else
                    setWarning(false)
            })

    }

    return (
        <React.Fragment>
            <Swiper direction={'vertical'} slidesPerView={1} spaceBetween={1} mousewheel={false}
                allowTouchMove={false}
                pagination={{
                    "type": "progressbar"
                }}
                onInit={(ev) => {
                    set_my_swiper(ev)
                }}
                className="mySwiper">
                <SwiperSlide className="overflow-auto pt-5">
                    <div className="col-10 col-xl-6 col-lg-6 col-md-8 col-sm-8">
                        <div className="mb-3 text-product">
                            <label className="form-label" htmlFor="offer-title">TEKLİFİN BAŞLIĞI:</label>
                            <input className="form-control" placeholder="Örnek:  Alt Yapı İmalatı" type="text" id="offer-title" name="offer-title" />
                        </div>

                        <div className="mb-3 text-product">
                            <label className="form-label" htmlFor="company-name">TEKLİF YAPILACAK ŞİRKET YA DA ŞAHIS:</label>
                            <input className="form-control" placeholder="Örnek:  Sayın ABC İnşaat Yetkilisi" type="text" id="company-name" name="company-name" />
                        </div>

                        <div className="mb-3 text-product row">
                            <label className="col-3 col-form-label" htmlFor="custom-date">TARİH:</label>
                            <div className="col-9">
                                <input className="form-control" type="date" id="custom-date" name="custom-date" />
                            </div>
                        </div>

                        <div className="mb-3 text-product row">
                            <label className="col-4 col-lg-3 col-form-label" htmlFor="profit-rate">KAR ORANI:</label>
                            <div className="col-8 col-lg-9">
                                <input className="form-control" placeholder="Örnek: 20" type="number" defaultValue="0" min="0" id="profit-rate" name="profit-rate" />
                            </div>
                        </div>

                        <div className="mb-3 text-product row">
                            <label className="col-6 col-lg-5 col-md-6 col-sm-7 col-form-label" htmlFor="profit-rate">TAHMİNİ BİTİŞ SÜRESİ:</label>
                            <div className="col-6 col-lg-7 col-md-6 col-sm-5">
                                <input className="form-control" placeholder="Örnek: 20" type="number" defaultValue="0" min="0" id="day" name="day" />
                            </div>
                        </div>

                        <div className="mb-3 form-check">
                            <input className="form-check-input" type="checkbox" id="name-check" name="name-check" onClick={nameHandler} />
                            <label className="form-check-label" htmlFor="name-check">Farklı bir kişi adına teklif yapacağım.</label>
                        </div>

                        <div className={nameCheckBox ? "d-none" : "mb-3 text-product row"}>
                            <label className="col-lg-3 col-form-label" htmlFor="name">Ad Soyad:</label>
                            <div className="col-lg-9">
                                <input className="form-control" type="text" defaultValue={name} id="name" name="name" />

                            </div>
                        </div>

                        <div className="d-flex justify-content-center">
                            <button className="btn btn-primary slide-btn p-0 mb-4" onClick={async (e) => {
                                e.preventDefault()
                                if (checkSlide1()) {
                                    fetchForSlide2()
                                    nextSlide(e)
                                }
                                else {
                                    setErrorSlide1(true)
                                }
                            }}> <i className="bi bi-arrow-down" style={{ fontSize: 1.3 + 'rem' }}></i> </button>
                        </div>

                    </div>
                </SwiperSlide>

                <SwiperSlide className="overflow-auto pt-5">
                    <div className="col-11 col-xl-8 col-lg-9 col-md-10 col-sm-11">
                        <div className="d-flex justify-content-center mb-3">
                            <button className="btn btn-primary slide-btn p-0" onClick={(e) => prevSlide(e)}> <i className="bi bi-arrow-up" style={{ fontSize: 1.3 + 'rem' }}></i> </button>
                        </div>

                        <table className="table table-bordered table-light round table-striped">
                            <thead className="table-dark">
                                <tr>
                                    <th className="text-center">#</th>
                                    <th>Malzemenin İsmi</th>
                                    <th>Birim Fiyatı</th>
                                    <th className="d-none d-sm-table-cell">Ölçü Birimi</th>
                                    <th>Birim Miktarı</th>
                                    <th className="text-center">Düzenle</th>
                                </tr>
                            </thead>
                            <tbody id="tableRows">
                                {realData.map((e, i) => {

                                    return (
                                        <tr key={e.material_id} id={e.material_id} className={e.is_fixed ? "table-warning" : ""} >
                                            <td className="text-center"> <input className="form-check-input checkboxs" type="checkbox" defaultChecked={e.is_fixed} onClick={(event) => checkHandler(event, e.is_fixed)} /> </td>
                                            <td>{e.material_name}</td>
                                            <td id={e.is_fixed ? "fixed" : null}>{e.material_price_per_unit} </td>
                                            <td className="d-none d-sm-table-cell">{e.material_unit}</td>
                                            <td>{e.is_fixed ? 1 : e.material_unit_quantity} </td>
                                            <td>
                                                <div className="d-flex justify-content-center">
                                                    <button className="btn btn-success" onClick={(e) => {
                                                        setSelectedRowID(i)
                                                        setBtnEdit(true)
                                                    }} ><i className="bi bi-pencil-square"></i></button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}

                            </tbody>
                        </table>

                        <div className="d-flex justify-content-center">
                            <button className="btn btn-primary slide-btn p-0 mb-4" onClick={(e) => {
                                e.preventDefault()
                                if (checkSlide2())
                                    nextSlide(e)
                            }}> <i className="bi bi-arrow-down" style={{ fontSize: 1.3 + 'rem' }}></i> </button>
                        </div>
                    </div>
                </SwiperSlide>

                <SwiperSlide className="overflow-auto pt-5">
                    <div className="col-11 col-xl-8 col-lg-9 col-md-10 col-sm-11">
                        <div className="d-flex justify-content-center mb-3">
                            <button className="btn btn-primary slide-btn p-0" onClick={(e) => prevSlide(e)}> <i className="bi bi-arrow-up" style={{ fontSize: 1.3 + 'rem' }}></i> </button>
                        </div>

                        <table className="table table-bordered table-light round mb-4">
                            <thead className="table-dark">
                                <tr>
                                    <th className="d-none d-sm-table-cell text-center">#</th>
                                    <th>Malzemenin İsmi</th>
                                    <th>Birim Fiyatı</th>
                                    <th className="d-none d-sm-table-cell">Ölçü Birimi</th>
                                    <th>Birim Miktarı</th>
                                    <th>Toplam Malzeme Tutarı</th>
                                </tr>
                            </thead>
                            <tbody id="tableRows">
                                {selectedMaterials.map((e, i) =>
                                    <tr key={i} >
                                        <td className="d-none d-sm-table-cell">{i + 1}</td>
                                        <td>{e.material.material_name}</td>
                                        <td>{e.offer_material_price_per_unit} </td>
                                        <td className="d-none d-sm-table-cell">{e.material.material_unit}</td>
                                        <td>{e.offer_material_unit_quantity} </td>
                                        <td>{e.offer_material_cost}</td>
                                    </tr>
                                )}

                            </tbody>
                        </table>

                        <Row>
                            <Col className="d-flex justify-content-sm-end" xs={{ span: 5, offset: 2 }} md={{ span: 3, offset: 6 }} ><b> <small>Ara Toplam: </small></b></Col>
                            <Col className="d-flex justify-content-end" xs={{ span: 4, offset: 0 }} md={3} >{formatter.format(totalPrice).replace('₺', " ") + " ₺"}</Col>
                        </Row>

                        <Row>
                            <Col className="d-flex justify-content-sm-end" xs={{ span: 5, offset: 2 }} md={{ span: 3, offset: 6 }}><b> <small>KDV Tutarı: </small></b></Col>
                            <Col className="d-flex justify-content-end" xs={{ span: 4, offset: 0 }} md={3}>{formatter.format(kdvPrice).replace('₺', " ") + " ₺"}</Col>
                        </Row>

                        <Row>
                            <Col className="d-flex justify-content-sm-end" xs={{ span: 5, offset: 2 }} md={{ span: 3, offset: 6 }}><b> <small>SGK Stopaj: </small></b></Col>
                            <Col className="d-flex justify-content-end" xs={{ span: 4, offset: 0 }} md={3}>{formatter.format(SGKPrice).replace('₺', " ") + " ₺"}</Col>
                        </Row>

                        <Row>
                            <Col className="d-flex justify-content-sm-end" xs={{ span: 5, offset: 2 }} md={{ span: 3, offset: 6 }}><span className='h5 fw-bold'>Genel Toplam: </span></Col>
                            <Col className="d-flex justify-content-end h5 fw-bold" xs={{ span: 4, offset: 0 }} md={3}>{formatter.format(kdvPrice + totalPrice + ~~SGKPrice).replace('₺', " ") + " ₺"} </Col>
                        </Row>

                        <div className="d-flex justify-content-sm-end justify-content-center mt-3">
                            <button className="btn btn-success mb-4" onClick={makeOffer}>Teklif Yap </button>
                        </div>
                    </div>

                </SwiperSlide>

            </Swiper>

            <Modal show={errorSlide1 || errorSlide2 || errorSlide3 || warning} onHide={handleClose} centered>
                <Modal.Header className={warning ? "bg-opacity-75 bg-success" : "bg-opacity-75 bg-danger"} closeButton>
                    <Modal.Title>{warning ? "Başarılı!" : "Hata"}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {errorSlide1 && "Bazı gerekli alanlar boş, lütfen eksiksiz doldurduğunuza emin olun!"
                    }
                    {errorSlide2 && "SGK stopaj bedeli haricinde en az 1 öğe seçilmelidir!"
                    }
                    {errorSlide3 && "En az bir satırın birim fiyatı ya da birim miktarı sıfır!"
                    }
                    {warning ? "Teklif başarılı bir şekilde yapıldı. Tekliflerim sekmesinden görüntüleyebilirsiniz!" : "Bir hata meydana geldi lütfen tekrar deneyin!"}

                </Modal.Body>
            </Modal>

            <Modal show={btnEdit} onHide={() => setBtnEdit(false)} centered>
                {btnEdit &&
                    <>
                        <Modal.Header className="bg-opacity-75 bg-warning" closeButton>
                            <Modal.Title>Düzenle ~ <span className="h6">{realData.length != 0 && selectedRowID != -1 ? realData[selectedRowID].material_name : ""}</span> </Modal.Title>
                        </Modal.Header>

                        <Modal.Body>
                            <Container>
                                <Row>
                                    <Col md={4} >
                                        <label className="col-form-label" htmlFor="price_per_unit"> <b>Birim Fiyatı :</b> </label>
                                    </Col>
                                    <Col>
                                        <input className="form-control" min="0" defaultValue={realData[selectedRowID].material_price_per_unit} id="price_per_unit" name="price_per_unit" type="number" />
                                    </Col>
                                </Row>
                                <br />
                                <Row>
                                    <Col md={4}>
                                        <label className="col-form-label" htmlFor="unit_quantity"><b>Birim Miktarı :</b></label>
                                    </Col>
                                    <Col>
                                        <input className="form-control" min="0" disabled={realData[selectedRowID].is_fixed ? true : false} defaultValue={realData[selectedRowID].is_fixed ? 1 : realData[selectedRowID].material_unit_quantity} id="unit_quantity" name="unit_quantity" type="number" />
                                    </Col>
                                </Row>
                            </Container>
                        </Modal.Body>

                        <Modal.Footer>
                            <Container>
                                <div className="d-flex justify-content-center">
                                    <button className="btn btn-success" onClick={updateTable} >Kaydet</button>
                                </div>
                            </Container>
                        </Modal.Footer>
                    </>
                }
            </Modal>

        </React.Fragment >
    )
}
