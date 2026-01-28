from django.db import models

# Branch model: Represents a physical store location
# This is where products are stored and sold
class Branch(models.Model):
    name = models.CharField(max_length=100)  # Store name (e.g., "Main Store", "Branch A")
    location = models.CharField(max_length=200)  # Store address or location
    
    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name_plural = "Branches"


# Product model: Represents items that can be sold
# This is the catalog of all available products
class Product(models.Model):
    name = models.CharField(max_length=100)  # Product name (e.g., "Laptop", "Mouse")
    price = models.DecimalField(max_digits=10, decimal_places=2)  # Product price in currency
    
    def __str__(self):
        return self.name


# Stock model: Tracks how many products are available at each branch
# This connects a Branch with a Product and shows the quantity available
class Stock(models.Model):
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE)  # Which branch has this stock
    product = models.ForeignKey(Product, on_delete=models.CASCADE)  # Which product is in stock
    quantity = models.IntegerField(default=0)  # How many units are available
    
    def __str__(self):
        return f"{self.product.name} at {self.branch.name}: {self.quantity} units"
    
    class Meta:
        # Prevent duplicate stock entries for same branch+product combination
        unique_together = ('branch', 'product')


# Sale model: Records when a product is sold at a branch
# This creates a history of all sales transactions
class Sale(models.Model):
    branch = models.ForeignKey(Branch, on_delete=models.CASCADE)  # Which branch made the sale
    product = models.ForeignKey(Product, on_delete=models.CASCADE)  # Which product was sold
    quantity = models.IntegerField()  # How many units were sold
    date = models.DateTimeField(auto_now_add=True)  # When the sale happened (automatically set)
    
    def __str__(self):
        return f"Sale: {self.quantity} x {self.product.name} at {self.branch.name} on {self.date}"

