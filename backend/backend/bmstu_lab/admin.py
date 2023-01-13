from django.contrib import admin
from .models import *
# Register your models here.


admin.site.register(Cart)
admin.site.register(CategoryProduct)
admin.site.register(GroupProduct)
admin.site.register(Order)
admin.site.register(Ordercart)
admin.site.register(Products)
admin.site.register(Statuses)

