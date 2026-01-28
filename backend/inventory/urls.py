from django.urls import path
from . import views

# URL patterns for the inventory API endpoints
# These URLs are accessed from the frontend to interact with the backend
urlpatterns = [
    # ========== AUTHENTICATION ==========
    # POST: Login user
    path('login/', views.login_view, name='login'),
    # POST: Logout user
    path('logout/', views.logout_view, name='logout'),
    # GET: Check authentication status
    path('check-auth/', views.check_auth, name='check_auth'),
    
    # GET: Get all products
    # Example: /api/products/
    path('products/', views.list_products, name='list_products'),
    
    # POST: Add a new product
    # Example: /api/add-product/
    path('add-product/', views.add_product, name='add_product'),
    
    # POST: Record a sale (also reduces stock automatically)
    # Example: /api/add-sale/
    path('add-sale/', views.add_sale, name='add_sale'),
    
    # GET: Get all stock information
    # Example: /api/stock/
    path('stock/', views.list_stock, name='list_stock'),
    
    # GET: Get all branches
    # Example: /api/branches/
    path('branches/', views.list_branches, name='list_branches'),
    
    # GET: Get all sales
    # Example: /api/sales/
    path('sales/', views.list_sales, name='list_sales'),
    
    # ========== PRODUCT CRUD ==========
    # GET: Get single product
    path('products/<int:product_id>/', views.get_product, name='get_product'),
    # PUT: Update product
    path('products/<int:product_id>/update/', views.update_product, name='update_product'),
    # DELETE: Delete product
    path('products/<int:product_id>/delete/', views.delete_product, name='delete_product'),
    
    # ========== BRANCH CRUD ==========
    # POST: Add branch
    path('add-branch/', views.add_branch, name='add_branch'),
    # GET: Get single branch
    path('branches/<int:branch_id>/', views.get_branch, name='get_branch'),
    # PUT: Update branch
    path('branches/<int:branch_id>/update/', views.update_branch, name='update_branch'),
    # DELETE: Delete branch
    path('branches/<int:branch_id>/delete/', views.delete_branch, name='delete_branch'),
    
    # ========== STOCK CRUD ==========
    # POST: Add stock
    path('add-stock/', views.add_stock, name='add_stock'),
    # GET: Get single stock
    path('stock/<int:stock_id>/', views.get_stock, name='get_stock'),
    # PUT: Update stock
    path('stock/<int:stock_id>/update/', views.update_stock, name='update_stock'),
    # DELETE: Delete stock
    path('stock/<int:stock_id>/delete/', views.delete_stock, name='delete_stock'),
    
    # ========== SALE OPERATIONS ==========
    # DELETE: Delete sale (restores stock)
    path('sales/<int:sale_id>/delete/', views.delete_sale, name='delete_sale'),
]

