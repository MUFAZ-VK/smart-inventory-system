from rest_framework import serializers
from .models import Branch, Product, Stock, Sale

# Branch Serializer: Converts Branch model to/from JSON
# Used to send branch data to frontend and receive it from frontend
class BranchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Branch
        fields = '__all__'  # Include all fields: id, name, location


# Product Serializer: Converts Product model to/from JSON
# Used to send product data to frontend and receive it from frontend
class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'  # Include all fields: id, name, price


# Stock Serializer: Converts Stock model to/from JSON
# Shows branch name and product name instead of just IDs for better readability
class StockSerializer(serializers.ModelSerializer):
    branch_name = serializers.CharField(source='branch.name', read_only=True)  # Show branch name
    product_name = serializers.CharField(source='product.name', read_only=True)  # Show product name
    
    class Meta:
        model = Stock
        fields = '__all__'  # Include all fields: id, branch, product, quantity, branch_name, product_name


# Sale Serializer: Converts Sale model to/from JSON
# Shows branch name and product name instead of just IDs for better readability
class SaleSerializer(serializers.ModelSerializer):
    branch_name = serializers.CharField(source='branch.name', read_only=True)  # Show branch name
    product_name = serializers.CharField(source='product.name', read_only=True)  # Show product name
    
    class Meta:
        model = Sale
        fields = '__all__'  # Include all fields: id, branch, product, quantity, date, branch_name, product_name

