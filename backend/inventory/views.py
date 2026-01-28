from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import authenticate, login, logout
from django.views.decorators.csrf import csrf_exempt
from .models import Branch, Product, Stock, Sale
from .serializers import BranchSerializer, ProductSerializer, SaleSerializer, StockSerializer

# ========== AUTHENTICATION ==========

@api_view(['POST'])
@csrf_exempt
@authentication_classes([])
@permission_classes([AllowAny])
def login_view(request):
    """
    Authenticates user and creates a session.
    Exempted from CSRF and authentication classes to allow the initial login request.
    """
    username = request.data.get('username')
    password = request.data.get('password')
    
    if not username or not password:
        return Response(
            {'error': 'Username and password are required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    user = authenticate(request, username=username, password=password)
    
    if user is not None:
        login(request, user)
        return Response({
            'success': True,
            'message': 'Login successful',
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'is_staff': user.is_staff,
            }
        }, status=status.HTTP_200_OK)
    else:
        return Response(
            {'error': 'Invalid username or password'},
            status=status.HTTP_401_UNAUTHORIZED
        )

@api_view(['POST'])
@csrf_exempt
@authentication_classes([])
@permission_classes([AllowAny])
def logout_view(request):
    """Terminates the user session."""
    logout(request)
    return Response({
        'success': True,
        'message': 'Logout successful'
    }, status=status.HTTP_200_OK)

@api_view(['GET'])
def check_auth(request):
    """Returns the current user's authentication status and profile data."""
    if request.user.is_authenticated:
        return Response({
            'authenticated': True,
            'user': {
                'id': request.user.id,
                'username': request.user.username,
                'email': request.user.email,
                'is_staff': request.user.is_staff,
            }
        }, status=status.HTTP_200_OK)
    else:
        return Response({
            'authenticated': False
        }, status=status.HTTP_401_UNAUTHORIZED)

# ========== PRODUCTS ==========

@api_view(['GET'])
def list_products(request):
    """Fetches a list of all products with optimized field selection."""
    products = Product.objects.all().only('id', 'name', 'price')
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def add_product(request):
    """
    Registers a new product. Products are global across all branches.
    If branch/quantity provided, also initializes stock level.
    """
    serializer = ProductSerializer(data=request.data)
    
    if serializer.is_valid():
        # Save product to database (product is global, available to all branches)
        product = serializer.save()
        
        # Branch and stock_quantity are OPTIONAL - if provided, create initial stock
        branch_id = request.data.get('branch')
        stock_quantity = request.data.get('stock_quantity')
        
        # If branch and stock quantity are provided, create stock for that branch
        if branch_id and stock_quantity is not None:
            try:
                branch = Branch.objects.get(id=branch_id)
                stock_quantity_int = int(stock_quantity)
                
                # Check if stock already exists for this branch and product
                stock, created = Stock.objects.get_or_create(
                    branch=branch,
                    product=product,
                    defaults={'quantity': stock_quantity_int}
                )
                
                # If stock already exists, update the quantity
                if not created:
                    stock.quantity += stock_quantity_int
                    stock.save()
                
            except Branch.DoesNotExist:
                return Response(
                    {'error': 'Branch not found'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            except ValueError:
                return Response(
                    {'error': 'Invalid stock quantity'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)  # Return success response
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)  # Return error if invalid


# View to record a sale
# Receives sale data from frontend, saves the sale, and reduces stock quantity
@api_view(['POST'])
def add_sale(request):
    serializer = SaleSerializer(data=request.data)  # Convert JSON to Sale object
    
    if serializer.is_valid():  # Check if data is valid
        # Get the branch and product from the validated data
        branch_id = serializer.validated_data['branch'].id
        product_id = serializer.validated_data['product'].id
        sale_quantity = serializer.validated_data['quantity']
        
        # Find the stock record for this branch and product
        try:
            stock = Stock.objects.get(branch_id=branch_id, product_id=product_id)
        except Stock.DoesNotExist:
            # If stock doesn't exist, return error
            return Response(
                {'error': 'Stock not found for this branch and product'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if there's enough stock
        if stock.quantity < sale_quantity:
            return Response(
                {'error': 'Not enough stock available'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Reduce the stock quantity
        stock.quantity -= sale_quantity
        stock.save()  # Save updated stock to database
        
        # Save the sale record
        serializer.save()  # Save sale to database
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)  # Return success response
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)  # Return error if invalid


# View to get all stock information
# Returns a list of all stock records (which products are at which branches)
@api_view(['GET'])
def list_stock(request):
    # Use select_related() to fetch branch and product in a single query (prevents N+1 queries)
    stock_records = Stock.objects.select_related('branch', 'product').all()
    serializer = StockSerializer(stock_records, many=True)  # Convert to JSON format
    return Response(serializer.data)  # Send JSON response to frontend


# View to get all branches
# Returns a list of all branches in the database
@api_view(['GET'])
def list_branches(request):
    # Use only() to fetch only needed fields for better performance
    branches = Branch.objects.all().only('id', 'name', 'location')
    serializer = BranchSerializer(branches, many=True)  # Convert to JSON format
    return Response(serializer.data)  # Send JSON response to frontend


# View to get all sales
# Returns a list of all sales records for the dashboard
@api_view(['GET'])
def list_sales(request):
    # Use select_related() to fetch branch and product in a single query (prevents N+1 queries)
    # Use only() to limit fields for better performance
    sales = Sale.objects.select_related('branch', 'product').only(
        'id', 'branch', 'product', 'quantity', 'date',
        'branch__name', 'product__name'
    )
    serializer = SaleSerializer(sales, many=True)  # Convert to JSON format
    return Response(serializer.data)  # Send JSON response to frontend


# ========== PRODUCT CRUD OPERATIONS ==========

# View to get a single product by ID
@api_view(['GET'])
def get_product(request, product_id):
    try:
        product = Product.objects.get(id=product_id)
        serializer = ProductSerializer(product)
        return Response(serializer.data)
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)


# View to update a product
@api_view(['PUT'])
def update_product(request, product_id):
    try:
        product = Product.objects.get(id=product_id)
        serializer = ProductSerializer(product, data=request.data)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)


# View to delete a product
@api_view(['DELETE'])
def delete_product(request, product_id):
    try:
        product = Product.objects.get(id=product_id)
        product.delete()
        return Response({'message': 'Product deleted successfully'}, status=status.HTTP_200_OK)
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=status.HTTP_404_NOT_FOUND)


# ========== BRANCH CRUD OPERATIONS ==========

# View to add a new branch
@api_view(['POST'])
def add_branch(request):
    serializer = BranchSerializer(data=request.data)
    
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# View to get a single branch by ID
@api_view(['GET'])
def get_branch(request, branch_id):
    try:
        branch = Branch.objects.get(id=branch_id)
        serializer = BranchSerializer(branch)
        return Response(serializer.data)
    except Branch.DoesNotExist:
        return Response({'error': 'Branch not found'}, status=status.HTTP_404_NOT_FOUND)


# View to update a branch
@api_view(['PUT'])
def update_branch(request, branch_id):
    try:
        branch = Branch.objects.get(id=branch_id)
        serializer = BranchSerializer(branch, data=request.data)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Branch.DoesNotExist:
        return Response({'error': 'Branch not found'}, status=status.HTTP_404_NOT_FOUND)


# View to delete a branch
@api_view(['DELETE'])
def delete_branch(request, branch_id):
    try:
        branch = Branch.objects.get(id=branch_id)
        branch.delete()
        return Response({'message': 'Branch deleted successfully'}, status=status.HTTP_200_OK)
    except Branch.DoesNotExist:
        return Response({'error': 'Branch not found'}, status=status.HTTP_404_NOT_FOUND)


# ========== STOCK CRUD OPERATIONS ==========

# View to get a single stock record by ID
@api_view(['GET'])
def get_stock(request, stock_id):
    try:
        # Use select_related to fetch related objects in one query
        stock = Stock.objects.select_related('branch', 'product').get(id=stock_id)
        serializer = StockSerializer(stock)
        return Response(serializer.data)
    except Stock.DoesNotExist:
        return Response({'error': 'Stock not found'}, status=status.HTTP_404_NOT_FOUND)


# View to update stock quantity
@api_view(['PUT'])
def update_stock(request, stock_id):
    try:
        stock = Stock.objects.get(id=stock_id)
        serializer = StockSerializer(stock, data=request.data)
        
        if serializer.is_valid():
            # Validate quantity is positive if provided
            quantity = serializer.validated_data.get('quantity', stock.quantity)
            if quantity < 0:
                return Response(
                    {'error': 'Quantity cannot be negative'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Stock.DoesNotExist:
        return Response({'error': 'Stock not found'}, status=status.HTTP_404_NOT_FOUND)


# View to delete a stock record
@api_view(['DELETE'])
def delete_stock(request, stock_id):
    try:
        stock = Stock.objects.get(id=stock_id)
        stock.delete()
        return Response({'message': 'Stock deleted successfully'}, status=status.HTTP_200_OK)
    except Stock.DoesNotExist:
        return Response({'error': 'Stock not found'}, status=status.HTTP_404_NOT_FOUND)


# View to add stock manually
# If stock already exists for the branch-product combination, adds to existing quantity
# If stock doesn't exist, creates a new stock record
@api_view(['POST'])
def add_stock(request):
    # First validate the basic data structure
    branch_id = request.data.get('branch')
    product_id = request.data.get('product')
    quantity = request.data.get('quantity')
    
    # Validate required fields
    if not branch_id or not product_id or quantity is None:
        return Response(
            {'error': 'Branch, product, and quantity are required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Validate quantity is positive
    try:
        quantity = int(quantity)
        if quantity <= 0:
            return Response(
                {'error': 'Quantity must be greater than 0'},
                status=status.HTTP_400_BAD_REQUEST
            )
    except (ValueError, TypeError):
        return Response(
            {'error': 'Quantity must be a valid number'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Validate branch and product exist
    try:
        branch = Branch.objects.get(id=branch_id)
    except Branch.DoesNotExist:
        return Response(
            {'error': f'Branch with ID {branch_id} does not exist'},
            status=status.HTTP_400_BAD_REQUEST
        )
    except (ValueError, TypeError):
        return Response(
            {'error': 'Invalid branch ID'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        product = Product.objects.get(id=product_id)
    except Product.DoesNotExist:
        return Response(
            {'error': f'Product with ID {product_id} does not exist'},
            status=status.HTTP_400_BAD_REQUEST
        )
    except (ValueError, TypeError):
        return Response(
            {'error': 'Invalid product ID'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Use get_or_create to handle the unique constraint atomically
    # This prevents race conditions and handles the unique_together constraint
    try:
        stock, created = Stock.objects.get_or_create(
            branch=branch,
            product=product,
            defaults={'quantity': quantity}
        )
        
        if not created:
            # Stock already exists, add to existing quantity
            stock.quantity += quantity
            stock.save()
        
        # Return the stock data
        serializer = StockSerializer(stock)
        return Response(serializer.data, status=status.HTTP_200_OK)
        
    except Exception as e:
        # Handle any unexpected database errors
        return Response(
            {'error': f'Failed to add stock: {str(e)}'},
            status=status.HTTP_400_BAD_REQUEST
        )


# ========== SALE OPERATIONS ==========

# View to delete a sale
@api_view(['DELETE'])
def delete_sale(request, sale_id):
    try:
        sale = Sale.objects.get(id=sale_id)
        # Restore stock when deleting a sale
        branch_id = sale.branch.id
        product_id = sale.product.id
        sale_quantity = sale.quantity
        
        # Find and restore stock
        try:
            stock = Stock.objects.get(branch_id=branch_id, product_id=product_id)
            stock.quantity += sale_quantity
            stock.save()
        except Stock.DoesNotExist:
            # If stock doesn't exist, create it
            Stock.objects.create(
                branch=sale.branch,
                product=sale.product,
                quantity=sale_quantity
            )
        
        sale.delete()
        return Response({'message': 'Sale deleted successfully. Stock has been restored.'}, status=status.HTTP_200_OK)
    except Sale.DoesNotExist:
        return Response({'error': 'Sale not found'}, status=status.HTTP_404_NOT_FOUND)
