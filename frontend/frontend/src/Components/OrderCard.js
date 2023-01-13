import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import {useState} from "react";
import {Button} from "react-bootstrap";
import Modal from 'react-bootstrap/Modal';
import Select from 'react-select';
import api_socket from "../network";


const OrderCard = ({ is_manager, order, manager_page, statuses }) => {

    const [show, setShow] = useState(false);
    const [newOrderStatus, setNewOrderStatus] = useState(order.status.id)
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    // Логика изменения статусов:
    // cur_status - текущий статус, в зависимости от него
    // Предоставляем на выбор другие статусы
    const getOptions = (cur_status) => {
        switch (cur_status) {
            case 1:
                return [
                    {
                        value: 2,
                        label: 'Оплачено'
                    },
                    {
                        value: 5,
                        label: 'Отказано'
                    }
                ]
            case 2:
                return [
                    {
                        value: 3,
                        label: 'Доставляется'
                    },
                    {
                        value: 5,
                        label: 'Отказано'
                    }
                ]
            case 3:
                return [
                    {
                        value: 2,
                        label: 'Оплачено'
                    },
                    {
                        value: 4,
                        label: 'Отменено'
                    },
                    {
                        value: 6,
                        label: 'Доставлено'
                    }
                ]
            case 6:
                return [
                    {
                        value: 7,
                        label: 'Завершено'
                    },
                    {
                        value: 2,
                        label: 'Оплачено'
                    }
                ]
        }
    }

    const getFullPrice = (order) => {
        const items = order.ordered_items;
        let fullprice = 0;
        items.forEach(item => fullprice += item.amount * item.price)
        return fullprice
    }

    return (
        <>
            <Card>
                <Card.Body>
                    <Card.Title>Заказ №{order.id}</Card.Title>
                    <Card.Text>
                        {is_manager ? <>Пользователь: {order.user}<br/></>: undefined}
                        Дата заказа: {new Date(order.creation_date).toLocaleString()}<br/>
                        Дата изменения: {order.edition_date?new Date(order.edition_date).toLocaleString():'Еще не оплачено'}<br/>
                        Дата доставки: {order.completition_date?new Date(order.completition_date).toLocaleString():'Еще не доставлено'}<br/>
                        Стоимость: {getFullPrice(order)} ₽<br/>
                        Текущий статус: {order.status.name}
                    </Card.Text>
                </Card.Body>
                <ListGroup className="list-group-flush" style={{alignSelf: "self-start"}}>
                    {order.ordered_items.map((item, index) => {
                        return (
                            <ListGroup.Item key={index}>
                                {index + 1}) {item.product.name}, кол-во: {item.amount} шт., сумма: {item.amount*item.price} ₽
                            </ListGroup.Item>
                        )
                    })}
                </ListGroup>
                {!is_manager || !manager_page ? undefined:
                    <Card.Body>

                        <Button onClick={event => {
                            event.preventDefault()
                            handleShow()
                        }
                        }>Изменить статус</Button>
                        {order.status.id ===1||order.status.id ===2||order.status.id ===3||order.status.id ===6||order.status.id ===7?
                            <Button disabled>Удалить</Button>:
                                <Button onClick={async (event) =>{
                                    event.preventDefault()
                                    for(let i=0;i<order.ordered_items.length;i++) {
                                        await fetch(`http://${api_socket}/ordercart/${order.ordered_items[i].id}`, {
                                            method: 'DELETE',
                                            headers: {
                                                'Authorization': ` Bearer ${localStorage.getItem('accessToken')}`,
                                                'Content-Type': 'application/json'
                                            },
                                        })
                                    }
                                }
                        }>Удалить</Button>}

                    </Card.Body>
                }
            </Card>

            {!is_manager || !manager_page ? undefined:
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Изменение статуса заказа №{order.id}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Новый статус:
                        <Select
                            className="basic-single"
                            classNamePrefix="статус"
                            defaultValue={statuses.map(item => {
                                return {
                                    value: item.id,
                                    label: item.name
                                }
                            }).filter(item => item.value === order.status.id)[0]}
                            name="color"
                            options={getOptions(newOrderStatus)}
                            onChange={choice => {
                                setNewOrderStatus(choice.value)}
                            }
                        />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Закрыть
                        </Button>
                        <Button variant="primary" onClick={event => {
                            // запрос на изменение статуса
                            const options = {
                                method: 'PATCH',
                                headers:{
                                    'Authorization':` Bearer ${localStorage.getItem('accessToken')}`,
                                    'Content-Type':'application/json'
                                },
                                body: JSON.stringify({
                                    status: newOrderStatus,
                                    edition_date: new Date().toISOString(),
                                    completition_date:  [4, 5, 7].includes(newOrderStatus)? new Date().toISOString(): null
                                })
                            };
                            fetch(`http://${api_socket}/orderm/${order.id}/`, options)
                                .then(response => response.json())
                                .then(response => console.log(response))
                                .catch(err => console.error(err));
                            handleClose()
                        }}>
                            Сохранить
                        </Button>
                    </Modal.Footer>
                </Modal>
            }
        </>
    );
}

export default OrderCard;