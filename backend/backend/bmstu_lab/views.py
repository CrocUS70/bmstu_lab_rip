from django.shortcuts import render

from bmstu_lab.serialisers import *
from bmstu_lab.models import *
from django.db.models import Max, Min
from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework import viewsets
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.contrib.auth import authenticate, login
from django.http import HttpResponseRedirect, HttpResponse
from django.contrib.auth.models import Group
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAuthenticatedOrReadOnly, IsAdminUser, IsManagerOrReadOnly

"""
def home(request):
    return redirect('views_products')

def views_products(request):
    return render(request, 'views_products.html', {'data': {
        'current_date': date.today().strftime('%d.%m.%y'),
        'view': views_product.objects.all()
    }})

def group_products(request, id):
    return render(request, 'group_products.html', {'data': {
        'current_date': date.today().strftime('%d.%m.%y'),
        'group': group_products2.objects.filter(views_id=id),
        'v': views_product.objects.get(id=id)
    }})


def products(request, id):
    return render(request, 'products.html', {'data': {
        'current_date': date.today().strftime('%d.%m.%y'),
        'pro': products2.objects.filter(group_id=id),
        'g': group_products2.objects.get(id=id)
    }})


def product(request, id):
    return render(request, 'product.html', {'data': {
        'current_date': date.today().strftime('%d.%m.%y'),
        'prod': products2.objects.filter(id=id)[0],
        'p': products2.objects.get(id=id)
    }})
"""
# Create your views here.

@api_view(['GET'])
def get_price_limits(request, catid):
    return Response(Products.objects.filter(category=catid).aggregate(min_cost=Min('price'),max_cost = Max('price')))

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_manager(request):
    user = request.user
    return Response(user.groups.filter(name='manager').exists())

class CategoryViewSet(viewsets.ModelViewSet):
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    queryset=CategoryProduct.objects.all().order_by('id')


class GroupViewSet(viewsets.ModelViewSet):
    serializer_class = GroupSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    queryset=GroupProduct.objects.all().order_by('id')

class ProductsViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticatedOrReadOnly]
    def get_serializer_class(self):
        if self.request.method == 'GET':
            return ProductSerializer
        else:
            return EmptyProductSerializer

    def get_queryset(self):

        queryset = Products.objects.filter(category = self.kwargs['category_pk'])
        if self.request.method == 'GET':
            params = self.request.query_params.dict()
            try:
                queryset = queryset.filter(name__icontains=params['name'])
            except:
                pass
            try:
                queryset = queryset.filter(price__lte=params['max_cost'])
            except:
                pass
            try:
                queryset = queryset.filter(price__gte=params['min_cost'])
            except:
                pass
            try:
                queryset = queryset.filter(group__in=params['groups'].split(','))
            except:
                pass
        return queryset.order_by("id")



class CartViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticatedOrReadOnly]
    def get_serializer_class(self):
        if self.request.method == 'GET':
            return CartSerializer
        else:
            return EmptyCartSerializer

    def get_queryset(self):
        queryset = Cart.objects.all()
        if self.request.method == 'GET':
            params = self.request.query_params.dict()
            try:
                queryset = queryset.filter(user=params['user'])
                try:
                    queryset = queryset.filter(product=params['product'])
                except:
                    pass
                return queryset.order_by("id")
            except:
                pass
        return queryset.order_by("id")

class StatusViewSet(viewsets.ModelViewSet):
    serializer_class = StatusSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    queryset = Statuses.objects.all().order_by('id')

class OrderCartViewSet(viewsets.ModelViewSet):
    serializer_class = EmptyOrderCartSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    queryset = Ordercart.objects.all().order_by('id')

class OrderViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticatedOrReadOnly]
    def get_serializer_class(self):
        if self.request.method == 'GET':
            return OrderSerializer
        else:
            return EmptyOrderSerializer

    def get_queryset(self):
        queryset = Order.objects.all()
        if self.request.method == 'GET':
            params = self.request.query_params.dict()
            try:
                queryset = queryset.filter(user=params['user'])
                try:
                    queryset = queryset.filter(creation_date__gte=params['start_date'])
                except:
                    pass
                try:
                    queryset = queryset.filter(creation_date__lte=params['end_date'])
                except:
                    pass
                try:
                    queryset = queryset.filter(status__in=params['statuses'].split(','))
                except:
                    pass
                return queryset.order_by("-creation_date")
            except:
                pass
        return queryset.order_by("-creation_date")



class MGROrderViewSet(viewsets.ModelViewSet):
    permission_classes = [IsManagerOrReadOnly]
    def get_serializer_class(self):
        if self.request.method == 'GET':
            return OrderSerializer
        else:
            return EmptyOrderSerializer

    def get_queryset(self):
        queryset = Order.objects.all()
        if self.request.method == 'GET':
            params = self.request.query_params.dict()
            try:
                try:
                    queryset = queryset.filter(creation_date__gte=params['start_date'])
                except:
                    pass
                try:
                    queryset = queryset.filter(creation_date__lte=params['end_date'])
                except:
                    pass
                try:
                    queryset = queryset.filter(status__in=params['statuses'].split(','))
                except:
                    pass
                return queryset.order_by("-creation_date")
            except:
                pass
        return queryset.order_by("-creation_date")

@api_view(['GET', 'POST'])
def setUser(request):
        if request.method == 'POST':
            user = User.objects.create_user(username=request.data['username'], password=request.data['password'])
            customer = Group.objects.get(name='Customer')
            customer.user_set.add(user)
            user.save()
            print(request.data)
            return HttpResponse("{'status': 'ok'}")
        else:
            return HttpResponse("{'status': 'denied'}")


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request: Request):
    print(1,request.data)
    serializer = LoginRequestSerializer(data=request.data)
    if serializer.is_valid():
        authenticated_user = authenticate(**serializer.validated_data)
        if authenticated_user is not None:
            login(request, authenticated_user)
            return HttpResponse(status=200)
        else:
            return Response({'error': 'Invalid credentials'}, status=403)
    else:
        return Response(serializer.errors, status=400)

@api_view()
@permission_classes([IsAuthenticated])
@authentication_classes([JWTAuthentication])
def user(request: Request):
    print(AUserSerializer(request.user).data)

    return Response({
        'data': AUserSerializer(request.user).data,
    })




class ProductsMViewSet(viewsets.ModelViewSet):
    permission_classes = [IsManagerOrReadOnly]
    def get_serializer_class(self):
        if self.request.method == 'GET':
            return ProductSerializer
        else:
            return EmptyProductSerializer

    def get_queryset(self):

        queryset = Products.objects.all()
        return queryset.order_by("id")
