import {Button, Card} from "react-bootstrap";
import React from "react";
import {Link} from "react-router-dom";
import {useDispatch} from "react-redux";
import {fetchcart} from "../store/middlewares/CartPageMiddlewares";
import api_socket from "../network";

const CartCard = (data) => {
    const userid = localStorage.getItem('userId')
    const dispatch = useDispatch()

    const CartAdd = async() =>{

        const key = data.id
        const data_to_send = {
            "user": userid-0,
            "service": data.product.id-0,
            "amount": data.amount+1
        }
        await fetch(`http://${api_socket}/cart/${key}/?user=${userid}`,{
            method: 'PUT',
            headers:{
                'Authorization':` Bearer ${localStorage.getItem('accessToken')}`,
                'Content-Type':'application/json'
            },
            body: JSON.stringify(data_to_send)
        }).then((response) => {
            console.log(response)
        })
        dispatch(fetchcart(userid))
    }
    const CartRemove = async() =>{
        const key = data.id
        const data_to_send = {
            "user": userid-0,
            "service": data.product.id-0,
            "amount": data.amount-1
        }
        if (data_to_send.amount <=0){
            await fetch(`http://${api_socket}/cart/${key}/?user=${userid}`,{
                method: 'DELETE',
                headers:{
                    'Authorization':` Bearer ${localStorage.getItem('accessToken')}`,
                    'Content-Type':'application/json'
                }
            }).then((response) => {
                console.log(response)
                console.log(data_to_send)
            })
        }
        else{
            await fetch(`http://${api_socket}/cart/${key}/?user=${userid}`,{
                method: 'PUT',
                headers:{
                    'Authorization':` Bearer ${localStorage.getItem('accessToken')}`,
                    'Content-Type':'application/json'
                },
                body: JSON.stringify(data_to_send)
            }).then((response) => {
                console.log(response)
                console.log(data_to_send)
            })
        }
        dispatch(fetchcart(userid))
    }
    const CartDelete = async() =>{
        const key = data.id
        await fetch(`http://${api_socket}/cart/${key}/?user=${userid}`,{
            method: 'DELETE',
            headers:{
                'Authorization':` Bearer ${localStorage.getItem('accessToken')}`,
                'Content-Type':'application/json'
            }
        }).then((response) => {
            console.log(response)
        })
        dispatch(fetchcart(userid))
    }

    return <Card  className={"servicecard"}>
        <Card.Body>

            <Card.Title className={"title"}>{data.product.name}</Card.Title>
            <Card.Text  className={"seller"}>Группа: {data.product.group.name}</Card.Text>
            <Card.Text  className={"type"}>Назначение: {data.product.category.name}</Card.Text>
            <Card.Text  className={"amount"}>В корзине: {data.amount}.</Card.Text>
            <Card.Text  className={"Итого"}>Цена:{data.product.price*data.amount} руб.</Card.Text>
            <Button  className={"plus"} onClick={(event=>{
                CartAdd()
            })}>+</Button>
            <Button  className={"minus"} onClick={(event=>{
                CartRemove()
            })}>-</Button>
            <Button className={"delete"} onClick={(event=>{
                CartDelete()
            })}>Удалить</Button>
            <Link to={`../Category/${data.product.category.id}/product/${data.product.id}/`}>
                <Button  className={"button"}>Перейти</Button>
            </Link>

        </Card.Body>
    </Card>
}

export default CartCard;