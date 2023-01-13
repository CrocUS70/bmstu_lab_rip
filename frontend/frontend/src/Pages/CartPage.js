import React, {useEffect} from "react";
import {Button, Col, Row, Spinner} from 'react-bootstrap';
import Cartcard from "../Components/CartCard";
import { useSelector, useDispatch } from 'react-redux';
import {fetchcart} from "../store/middlewares/CartPageMiddlewares";
import api_socket from "../network";


function CartPage() {
    const userid = localStorage.getItem('userId')
    const loadingStatus = useSelector(state => state.ui.CartPage.loadingStatus)
    const fullprice = useSelector(state => {
        return state.cached_data.CartPage.fullprice
    })
    const CartList = useSelector(state => state.cached_data.CartPage.cartitems)
    const dispatch = useDispatch()

    useEffect(()=>{
        console.log("trying to load cart");
        dispatch(fetchcart(userid))
    },[]);
    const OrderAdd = async() =>{
        const userid = localStorage.getItem('userId')
        if (CartList.length){
            const data_to_send = {
                "user": userid-0,
                "status": 1,
                "price": fullprice,
                "creation_date": new Date(),
                "edition_date": null,
                "completition_date": null,
            }
            await fetch(`http://${api_socket}/order/?user=${userid}/`,{
                method: 'POST',
                headers:{
                    'Authorization':` Bearer ${localStorage.getItem('accessToken')}`,
                    'Content-Type':'application/json'
                },
                body: JSON.stringify(data_to_send)
            }).then((response) =>{
                return response.json()
            }).then(async (new_order)=>{
                const cartlenght = CartList.length
                console.log(new_order)
                for (let i=0;i<cartlenght;i++){
                    let orderdata={
                        "order": new_order.id-0,
                        "product": CartList[i].product.id-0,
                        "price": CartList[i].product.price-0,
                        "amount": CartList[i].amount-0
                    }
                    await fetch(`http://${api_socket}/ordercart/`,{
                        method: 'POST',
                        headers:{
                            'Authorization':` Bearer ${localStorage.getItem('accessToken')}`,
                            'Content-Type':'application/json'
                        },
                        body: JSON.stringify(orderdata)
                    })
                    await fetch(`http://${api_socket}/cart/${CartList[i].id}/?user=${userid}/`,{
                        method: 'DELETE',
                        headers:{
                            'Authorization':` Bearer ${localStorage.getItem('accessToken')}`,
                            'Content-Type':'application/json'
                        }
                    })
                }
            })}
        dispatch(fetchcart(userid))
    }



    return (
        <>
            <div className={`main-container ${loadingStatus && 'containerLoading'}`}>
                {loadingStatus ? <div className={"hide-while-loading-page"}><Spinner animation={"border"}/></div>:
                    <>
                        <div className={"CartGrid"}>
                            {!CartList.length ? <div className={"emptyresponse"}><h1>Корзина пуста</h1></div>:
                                <>
                                    <Row xs={1} sm={1} md={2} lg={2} className={"grid"}>
                                        {CartList.filter(cartitem => cartitem.amount>0).map((item, index) => {
                                            console.log(CartList)
                                            return (
                                                <Col key={index}>
                                                    <Cartcard {...item}/>
                                                </Col>
                                            )
                                        })}
                                    </Row>
                                </>}
                        </div>
                        <div className={"fullprice"}>{fullprice} руб.</div>
                        {fullprice <= 0 ? <Button className={"button"} disabled>Оформить заказ</Button>:
                            <Button className={"delete"} onClick={(event=>{
                                OrderAdd()
                            })}>Оформить заказ</Button>}
                    </>
                }
            </div>
        </>
    );
}

export default CartPage;