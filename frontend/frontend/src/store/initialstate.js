const initialState = {
    cached_data: {
        HomePage: {
            ctgList: []
        },
        CategoryPage: {
            productList:[],
            productprices:[0,0],
            groupList:[]
        },
        ProductPage: {
            product:{},
        },
        App:{
            userIsManager:false,
            userAuthorized: (localStorage.getItem('userId') !== ''),
        },
        CartPage:{
            cartitems:[],
            fullprice:1,
        },
        OrderPage: {
            ordersList:[],
            statusList:[],
        },
    },
    ui: {
        HomePage: {
            loadingStatus: true,
        },
        CategoryPage: {
            loadingStatus: true,
            textFieldValue: '',
            sliderValue: [0, 0],
            groupValue:[]
        },
        ProductPage: {
            loadingStatus: true
        },
        App: {
            AppBarLinks: [
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
                }
            ],
        },
        CartPage:{
            loadingStatus: true
        },
        OrderPage:{
            loadingStatus: true
        }
    }
}

export default initialState