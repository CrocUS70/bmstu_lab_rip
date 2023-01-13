from bmstu_lab.models import *
from rest_framework import serializers

class CategorySerializer(serializers.ModelSerializer):

    class Meta:
        model = CategoryProduct
        fields = '__all__'

class GroupSerializer(serializers.ModelSerializer):

    class Meta:
        model = GroupProduct
        fields = '__all__'

class EmptyProductSerializer(serializers.ModelSerializer):

    class Meta:
        model = Products
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):

    group = GroupSerializer(read_only=True)
    category = CategorySerializer(read_only=True)

    class Meta:
        model = Products
        fields = '__all__'

class LoginRequestSerializer(serializers.ModelSerializer):
    model = User
    username = serializers.CharField(required=True)
    password = serializers.CharField(required=True)


class CartSerializer(serializers.ModelSerializer):

    product = ProductSerializer(read_only=True)

    class Meta:
        model = Cart
        fields = '__all__'

class EmptyCartSerializer(serializers.ModelSerializer):


    class Meta:
        model = Cart
        fields = '__all__'

class StatusSerializer(serializers.ModelSerializer):

    class Meta:
        model = Statuses
        fields = '__all__'



class EmptyOrderSerializer(serializers.ModelSerializer):

    class Meta:
        model = Order
        fields = '__all__'

class OrderCartSerializer(serializers.ModelSerializer):

    product = ProductSerializer(read_only=True)
    #order = OrderSerializer(read_only=True)

    class Meta:
        model = Ordercart
        fields = ['id', 'order', 'product', 'amount', 'price']

class EmptyOrderCartSerializer(serializers.ModelSerializer):

    class Meta:
        model = Ordercart
        fields = '__all__'

class OrderSerializer(serializers.ModelSerializer):

    status = StatusSerializer(read_only=True)
    ordered_items = OrderCartSerializer(many=True,read_only=True)

    class Meta:
        model = Order
        fields = ["id", "price" , "user","status", "creation_date", "edition_date", "completition_date", "ordered_items"]

class AUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]