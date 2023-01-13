import {Button, Card} from "react-bootstrap";
import React, {useState} from "react";
import {Link, TextField} from "@mui/material";
import Modal from 'react-bootstrap/Modal';
import api_socket from "../network";
import {useDispatch, useSelector} from "react-redux";
import Select from "react-select";

const ProdCardManager = ({prod}) => {

    const groups = useSelector(state => state.cached_data.CategoryPage.groupList);

    // Состояния для отображения на странице
    const [qty, setQty] = useState(prod.amount)
    const [name, setName] = useState(prod.name)
    const [cost, setCost] = useState(prod.price)
    const [grp, setGrp] = useState(prod.group.name)
    const [ctg, setCtg] = useState(prod.category.name)
    const [shw, setShw] = useState(prod.is_shown) //is_shown = 1 => true, else false
    const [descr, setDescr] = useState(prod.description)

    // Состояния полей в модальных окнах
    const [qtyField, setQtyField] = useState(qty)
    const [nameField, setNameField] = useState(name)
    const [costField, setCostField] = useState(cost)
    const [grpField, setGrpField] = useState(grp)
    const [ctgField, setCtgField] = useState(ctg)
    const [descrField, setDescrField] = useState(descr)

    // Модальное окно для изменения
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const dispatch = useDispatch()

    return <Card>
        <Link
            href={`/Category/${prod.category.id}/product/${prod.id}`}
        >
            <Card.Img variant="top" src={`http://${api_socket}/${prod.picture}`}/>
        </Link>
        <Card.Body>
            <Link
                href={`/Category/${prod.category.id}/product/${prod.id}`}
            >
                <Card.Title>{name}</Card.Title>
            </Link>
            <div className={"card-info"}>
                <div className={"ctg-name"}>
                    Категория: {ctg}
                </div>
                <div className={"grp-name"}>
                    Группа: {grp}
                </div>
                <div className={"in_stock_qty"}>
                    В наличии: {qty} шт.
                </div>
                <div className={"one_instance_price"}>
                    Стоимость: {cost} ₽
                </div>
                {shw===1?
                <div className={"prod-is-shown"}>
                    Товар отображается
                </div>:<div className={"prod-is-shown"}>
                        Товар скрыт
                    </div>}
                <div>
                    Описание: {descr}
                </div>
            </div>
            <Button onClick={event => {
                event.preventDefault()
                handleShow()
            }}
            >
                Изменить
            </Button>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Редактирование информации о продукте</Modal.Title>
                </Modal.Header>
                <Modal.Body
                    style={{
                        gap:"10px",
                        display: "flex",
                        flexDirection: "column"
                    }}
                >
                    <TextField id="change-name" label={"Название"} variant="outlined"
                               value={nameField}
                               onChange={event => {
                                   event.preventDefault()
                                   setNameField(event.target.value)
                               }}
                               style={{width:"100%"}}
                    />
                    <TextField id="change-manga-qty" label={"Количество на складе"} variant="outlined"
                               value={qtyField}
                               onChange={event => {
                                   event.preventDefault()
                                   setQtyField(event.target.value)
                               }}
                               style={{width:"100%"}}
                    />
                    <TextField id="change-manga-cost" label={"Стоимость"} variant="outlined"
                               value={costField}
                               onChange={event => {
                                   event.preventDefault()
                                   setCostField(event.target.value)
                               }}
                               style={{width:"100%"}}
                    />
                    <TextField
                        id="change-descr"
                        label={"Описание"}
                        variant="outlined"
                        value={descrField}
                        onChange={event => {
                            event.preventDefault()
                            setDescrField(event.target.value)
                        }}
                        style={{width:"100%"}}
                        multiline={true}
                        rows={10}
                    />
                    <Select
                        className="basic-single"
                        classNamePrefix="Группа"
                        defaultValue={groups.map(item => {
                            return {
                                value: item.id,
                                label: item.name
                            }
                        }).filter(item => item.value === prod.group.id)[0]}
                        name="color"
                        options={groups.map(item => {
                            return {
                                value: item.id,
                                label: item.name
                            }
                        })}
                        onChange={choice => {
                            setGrpField(choice.value)}
                        }
                    />
                    <Select
                        className="basic-single"
                        classNamePrefix="Категория"
                        defaultValue={{
                            value: prod.category.id,
                            label: prod.category.name
                        }}
                        name="color"
                        options={[
                            {
                                value: 1,
                                label: "Военная продукция"
                            },
                            {
                                value: 2,
                                label: "Гражданская продукция"
                            }
                        ]}
                        onChange={choice => {
                            setCtgField(choice.value)}
                        }
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant={"secondary"} onClick={handleClose}>
                        Закрыть
                    </Button>
                    <Button variant={"primary"} onClick={event => {
                        event.preventDefault()
                        const options = {
                            method: 'PATCH',
                            headers:{
                                'Authorization':` Bearer ${localStorage.getItem('accessToken')}`,
                                'Content-Type':'application/json'
                            },
                            body: JSON.stringify({
                                group: grpField-0,
                                category: ctgField-0,
                                name: nameField,
                                description: descrField,
                                price: costField-0,
                                amount: qtyField-0,
                            })
                        };
                        fetch(`http://${api_socket}/prodm/${prod.id}/`, options)
                            .then(response => response.json())
                            .then(response => console.log(response))
                            .then(() => {
                                setQty(qtyField)
                                setName(nameField)
                                setCost(costField)
                                setGrp(grpField)
                                setCtg(ctgField)
                                setDescr(descrField)
                            })
                            .catch(err => console.error(err));
                        handleClose()
                    }
                    }>
                        Сохранить
                    </Button>
                </Modal.Footer>
            </Modal>
            <Button
                onClick={event => {
                    let outshw =1
                    if (shw===1){
                        outshw = 0
                        console.log(outshw)
                    }
                    const options = {
                        method: 'PATCH',
                        headers:{
                            'Authorization':` Bearer ${localStorage.getItem('accessToken')}`,
                            'Content-Type':'application/json'
                        },
                        body: JSON.stringify({
                            is_shown: outshw
                        })
                    };
                    fetch(`http://${api_socket}/prodm/${prod.id}/`, options)
                        .then(response => response.json())
                        .then(response => {
                            console.log(response)
                            setShw(outshw)
                        })
                        .catch(err => console.error(err));
                }
                }>{shw===1 ? <div>Показать</div>:<div>Скрыть</div>}</Button>
        </Card.Body>
    </Card>
}

export default ProdCardManager;