import { Card } from "react-bootstrap";
import React, {useState} from "react";
import {Link} from "@mui/material";
import api_socket from "../network";

const ProdCard = ({prod, is_manager}) => {

    const [qty, setQty] = useState(prod.amount)
    const [name, setName] = useState(prod.name)
    const [cost, setCost] = useState(prod.price)
    const [grp, setGrp] = useState(prod.group.name)

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
                <div className={"grp-name"}>
                    Группа: {grp}
                </div>
                <div className={"in_stock_qty"}>
                    В наличии: {qty} шт.
                </div>
                <div className={"one_instance_price"}>
                    Стоимость: {cost} ₽
                </div>
            </div>
        </Card.Body>
    </Card>
}

export default ProdCard;