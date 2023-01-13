"""bmstu_back URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path
from bmstu_lab import views as bmstu_lab_views
from rest_framework_nested import routers
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)


router = routers.SimpleRouter()
router.register(r'ctgs', bmstu_lab_views.CategoryViewSet, basename='category') #главная
router.register(r'cart', bmstu_lab_views.CartViewSet, basename='cart')
router.register(r'status', bmstu_lab_views.StatusViewSet, basename='status')
router.register(r'order', bmstu_lab_views.OrderViewSet, basename='order')
router.register(r'group', bmstu_lab_views.GroupViewSet, basename='groups of prods')
router.register(r'orderm', bmstu_lab_views.MGROrderViewSet, basename='mangerorder')
router.register(r'ordercart', bmstu_lab_views.OrderCartViewSet, basename='order details')
router.register(r'prodm', bmstu_lab_views.ProductsMViewSet, basename='prods')

ctg_router = routers.NestedSimpleRouter(router, r'ctgs', lookup='category')
ctg_router.register(r'prods', bmstu_lab_views.ProductsViewSet, basename='products') #разраб


urlpatterns = [
    path('', include(router.urls)),
    path('', include(ctg_router.urls)),

#    path('views_product/', views.views_products, name='views_products'),
 #   path('group_products/<int:id>', views.group_products, name='group_products'),
  #  path('products/<int:id>', views.products, name='products'),
   # path('product/<int:id>', views.product, name='product'),


    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    path('admin/', admin.site.urls),
    path('ismgr/', bmstu_lab_views.get_manager, name='is moderator'),
    path('prodprice/<int:catid>', bmstu_lab_views.get_price_limits),
    path('add_user', bmstu_lab_views.setUser, name='setUser'),
    path('api/user', bmstu_lab_views.user, name='user'),
    path('api/token/obtain', TokenObtainPairView.as_view(), name='token_obtain'),
    path('api/token/refresh', TokenRefreshView.as_view(), name='token_refresh'),
]
