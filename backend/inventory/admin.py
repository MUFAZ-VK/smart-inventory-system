from django.contrib import admin
from .models import Branch, Product, Stock, Sale

# Register Branch model: Allows managing store locations in Django admin
@admin.register(Branch)
class BranchAdmin(admin.ModelAdmin):
    list_display = ('name', 'location')  # Shows name and location in the list view
    search_fields = ('name', 'location')  # Allows searching by name or location


# Register Product model: Allows managing products in Django admin
@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'price')  # Shows name and price in the list view
    search_fields = ('name',)  # Allows searching by product name


# Register Stock model: Allows managing inventory levels in Django admin
@admin.register(Stock)
class StockAdmin(admin.ModelAdmin):
    list_display = ('branch', 'product', 'quantity')  # Shows branch, product, and quantity
    list_filter = ('branch', 'product')  # Adds filters for branch and product
    search_fields = ('branch__name', 'product__name')  # Allows searching by branch or product name


# Register Sale model: Allows viewing sales history in Django admin
@admin.register(Sale)
class SaleAdmin(admin.ModelAdmin):
    list_display = ('branch', 'product', 'quantity', 'date')  # Shows all sale details
    list_filter = ('branch', 'product', 'date')  # Adds filters for branch, product, and date
    search_fields = ('branch__name', 'product__name')  # Allows searching by branch or product name
    readonly_fields = ('date',)  # Prevents manual editing of the date (it's auto-set)

