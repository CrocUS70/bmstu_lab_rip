import React, {useState, useEffect} from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import {useDispatch, useSelector} from "react-redux";
import api_socket from "../network";
import {Link} from "react-router-dom";
import * as appAct from "../store/actionCreators/AppActionCreators";
import {useNavigate} from "react-router";
import {getProdm} from "../modules";
import {createAction_setuserIsManager} from "../store/actionCreators/AppActionCreators";

function ResponsiveAppBar() {

    const [anchorElNav, setAnchorElNav] = useState(null);

    const default_pages = useSelector(state => state.ui.App.AppBarLinks)
    const userStatus = useSelector(state => state.cached_data.App.userAuthorized)
    const userIsManager = useSelector(state => state.cached_data.App.userIsManager)

    const dispatch = useDispatch()
    const history = useNavigate()

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleLoginLogoutBtnClick = event => {
        event.preventDefault()
        if (userStatus) {
            localStorage.setItem('accessToken', '')
            localStorage.setItem('refreshToken', '')
            localStorage.setItem('userId', '')
            dispatch(appAct.createAction_setUserStatus(false))
            history('../auth')
        }
        else history('../auth')
    }
    const getmod = async()=>{
        fetch (`http://${api_socket}/ismgr/`,{
            headers: {
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            },
        }).then(response=>{
            console.log(response)
            return response.json();
        }).then((ismod)=>{
            console.log(ismod)
            if(ismod===true){
                console.log(ismod)
                dispatch(createAction_setuserIsManager(true))
            }
            else{
                console.log(ismod)
                dispatch(createAction_setuserIsManager(false))
            }
        })
    }

    useEffect(() => {

        if (userStatus) {
            getmod()
            dispatch(appAct.createAction_setAppBarLinks([
                {
                    title: 'Начальная страница',
                    link: '../'
                },
                {
                    title: 'Военная продукция',
                    link: '../Category/1/'
                },
                {
                    title: 'Гражданская продукция',
                    link: '../Category/2/'
                },
                {
                    title: 'Моя корзина',
                    link: '../cart'
                },
                {
                    title: 'Мои заказы',
                    link: '../purchases'
                }
            ]))
            if (userIsManager) {
                dispatch(appAct.createAction_setAppBarLinks([
                    {
                        title: 'Начальная страница',
                        link: '../'
                    },
                    {
                        title: 'Военная продукция',
                        link: '../Category/1/'
                    },
                    {
                        title: 'Гражданская продукция',
                        link: '../Category/2/'
                    },
                    {
                        title: 'Моя корзина',
                        link: '../cart'
                    },
                    {
                        title: 'Мои заказы',
                        link: '../purchases'
                    },
                    {
                        title: 'Панель менеджера',
                        link: '../ManageOrders'
                    },
                    {
                        title: 'Управление продуктами',
                        link: '../ProdManagerPage'
                    }
                ]))
            }
        }
        else {
            dispatch(appAct.createAction_deleteFromAppBarLinks('Моя корзина'))
            dispatch(appAct.createAction_deleteFromAppBarLinks('Мои заказы'))
            dispatch(appAct.createAction_deleteFromAppBarLinks('Панель менеджера'))
            dispatch(appAct.createAction_deleteFromAppBarLinks('Управление продуктами'))
        }

    }, [userStatus, userIsManager])

    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        href="/"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        Алмаз - Антей
                    </Typography>
                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: 'block', md: 'none' },
                            }}
                        >
                            {default_pages.map((page, index) => (
                                <MenuItem key={index} onClick={event => {
                                    event.preventDefault()
                                    handleCloseNavMenu()
                                }}>
                                    <Link
                                        key={index}
                                        style={{
                                            textDecoration: 'none',
                                            color: "black",
                                            cursor: "pointer"
                                        }}
                                        to={page.link}
                                    >
                                        {page.title}
                                    </Link>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                    <Typography
                        variant="h5"
                        noWrap
                        component="div"
                        href="/"
                        sx={{
                            mr: 2,
                            display: { xs: 'flex', md: 'none' },
                            flexGrow: 1,
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        Алмаз - Антей
                    </Typography>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {default_pages.map((page, index) => (
                            <Button
                                key={index}
                                onClick={event => {
                                    event.preventDefault()
                                    history(page.link)
                                }}
                                sx={{ my: 2, color: 'white', display: 'block' }}
                            >
                                {page.title}
                            </Button>
                        ))}
                    </Box>
                    <Button color="inherit" onClick={handleLoginLogoutBtnClick}>
                        {userStatus ? 'Выйти': 'Войти'}
                    </Button>
                </Toolbar>
            </Container>
        </AppBar>
    );
}
export default ResponsiveAppBar;