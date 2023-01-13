import React from 'react';
import { Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import BasicBreadcrumbs from "../Components/Breadcrumbs";

export default function HomePage() {

    return (
        <div
            className={'container'}
        >
            <BasicBreadcrumbs props={[
                {
                    ref: '/',
                    text: 'Начальная страница'
                }
            ]}/>
            <div
                className={'welcome-message'}
                style={{
                    display: "flex",
                    justifyContent: "center",
                    fontWeight: 400,
                    fontSize: 26
            }}
            >
                Добро пожаловать!
            </div>
            <div
                className={'prompt-to-select'}
                style={{
                    display: "flex",
                    justifyContent: "center",
                    fontSize: 18
                }}
            >
                Выберите вид продукции
            </div>
            <Row
                xs={1}
                md={2}
                sm={1}
                lg={2}
                className="grid"
            >
                <Col
                    key={1}
                >
                    <Link
                        to={"/Category/1/"}
                        style={{
                            alignSelf:"center"
                        }}
                    >
                        Военная продукция
                    </Link>
                </Col>
                <Col
                    key={2}
                >
                    <Link
                        to={"/Category/2/"}
                    >
                        Граждаснкая продукция
                    </Link>
                </Col>
            </Row>
        </div>
    )
}