import React, {useEffect} from 'react';
import {Col, Row, Spinner, Button} from "react-bootstrap";
import {useParams} from "react-router";
import BasicBreadcrumbs from "../Components/Breadcrumbs";
import api_socket from "../network";
import {useDispatch, useSelector} from "react-redux";
import {fetchprod} from "../store/middlewares/ProductPageMiddlewares";
import {getCartItem} from "../modules";
import {useLocation} from 'react-router'



function ProdPage() {

    const { ctgid, prodid } = useParams();

    const loadingStatus = useSelector(state => state.ui.ProductPage.loadingStatus)
    const prod = useSelector(state => {
        return state.cached_data.ProductPage.product
    })
    const dispatch = useDispatch()
    const location = useLocation()
    console.log(location)


    const CartAdd = async(prodid) =>{
        const userid = localStorage.getItem('userId')

        const cartitem = await getCartItem(userid,prodid)
        if (cartitem.length===0){
            const data_to_send = {
                "user": userid-0,
                "product": prodid-0,
                "amount": 1
            }
            await fetch(`http://${api_socket}/cart/?user=${userid}`,{
                method: 'POST',
                headers:{
                    'Authorization':` Bearer ${localStorage.getItem('accessToken')}`,
                    'Content-Type':'application/json'
                },
                body: JSON.stringify(data_to_send)
            }).then((response) => {
                console.log(response)
                console.log(data_to_send)
            })
                .catch((reason) => {
                    console.log(reason)
                    console.log(data_to_send)
                })
        }
        else{
            const key = cartitem[0].id
            const data_to_send = {
                "user": userid-0,
                "service": prodid-0,
                "amount": cartitem[0].amount+1
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
                console.log(data_to_send)
            })
                .catch((reason) => {
                    console.log(reason)
                    console.log(data_to_send)
                })
        }
        dispatch(fetchprod(ctgid,prodid))
    }


    useEffect(() => {
        console.log(location)
        console.log(1)
        dispatch(fetchprod(ctgid, prodid))

    },[location.key])



    return (
        <>
            <div className={`container`}>
                {loadingStatus ? <div className={"hide-while-loading-page"}><Spinner animation="border"/></div> :
                    <>
                        <BasicBreadcrumbs props={[
                            {
                                ref: '/',
                                text: '?????????????????? ????????????????'
                            },
                            {
                                ref: `/Category/${ctgid}/`,
                                text: prod.category.name
                            },
                            {
                                ref: `/Category/${ctgid}product/${prodid}`,
                                text: `${prod.name}`
                            }
                        ]}/>
                        <div className={"container"}>
                            {!prod.id || prod.is_shown === 0 ? <div className={"empty-result-message"}><h1>?????????????? ?? ?????? ?????? ?????????? ??????????????????:(</h1></div>:
                                <>
                                    <Row xs={1} md={1} sm={1} lg={2} className="grid">
                                        <Col  className={"img"}>
                                            <img src={`http://${api_socket}/${prod.picture}`}
                                                 alt={"????????????????"} className={"prod-img"} />
                                        </Col>
                                        <Col className={"info"}>
                                            <div className={"card-info"}>
                                                <div className={"prod-name"}>
                                                    ????????????????: {prod.name}
                                                </div>
                                                <div className={"grp-name"}>
                                                    ????????????: {prod.group.name}
                                                </div>
                                                <div className={"prod-description"}>
                                                    ????????????????: {prod.description}
                                                </div>
                                                <div className={"in_stock_qty"}>
                                                    ?? ??????????????: {prod.amount} ????.
                                                </div>
                                                <div className={"one_instance_price"}>
                                                    ??????????????????: {prod.price} ???
                                                </div>
                                                {prod.amount <= 0 ? <Button className={"button"} disabled>???????????????? ?? ????????????????</Button>:
                                                    <Button className={"button"} onClick={(event=>{
                                                        CartAdd(prodid)
                                                    })}>???????????????? ?? ????????????????</Button>}
                                            </div>
                                        </Col>
                                    </Row>
                                </>
                            }
                        </div>
                    </>
                }
            </div>
        </>
    );

}

export default ProdPage;