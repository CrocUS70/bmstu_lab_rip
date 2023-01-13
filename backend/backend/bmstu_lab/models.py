from django.db import models
from django.contrib.auth.models import User

# Create your models here.



class Cart(models.Model):
    product = models.ForeignKey('Products', models.DO_NOTHING, db_column='product', blank=True, null=True)
    user = models.ForeignKey(User, models.DO_NOTHING, db_column='user', blank=True, null=True)
    amount = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'cart'


class CategoryProduct(models.Model):
    name = models.CharField(unique=True, max_length=100, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'category_product'






class GroupProduct(models.Model):
    name = models.CharField(unique=True, max_length=100, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'group_product'


class Order(models.Model):
    price = models.FloatField(blank=True, null=True)
    user = models.ForeignKey(User, models.DO_NOTHING, db_column='user', blank=True, null=True)
    status = models.ForeignKey('Statuses', models.DO_NOTHING, db_column='status', blank=True, null=True)
    creation_date = models.DateTimeField(blank=True, null=True)
    edition_date = models.DateTimeField(blank=True, null=True)
    completition_date = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'order'


class Ordercart(models.Model):
    order = models.ForeignKey(Order, models.DO_NOTHING, db_column='order', blank=True, null=True, related_name="ordered_items")
    product = models.ForeignKey('Products', models.DO_NOTHING, db_column='product', blank=True, null=True)
    amount = models.IntegerField(blank=True, null=True)
    price = models.FloatField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'ordercart'


class Products(models.Model):
    name = models.CharField(max_length=100, blank=True, null=True)
    description = models.CharField(max_length=255, blank=True, null=True)
    price = models.FloatField(blank=True, null=True)
    amount = models.IntegerField(blank=True, null=True)
    picture = models.CharField(max_length=255, blank=True, null=True)
    is_shown = models.IntegerField(blank=True, null=True)
    category = models.ForeignKey(CategoryProduct, models.DO_NOTHING, db_column='category', blank=True, null=True)
    group = models.ForeignKey(GroupProduct, models.DO_NOTHING, db_column='group', blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'products'


class Statuses(models.Model):
    name = models.CharField(max_length=45, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'statuses'

