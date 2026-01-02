"""
Script to fix migration state when tables don't exist but Django thinks they do.
This will reset the migration state and reapply all migrations.
"""
import pymysql

# Database connection details
DB_CONFIG = {
    'host': 'nozomi.proxy.rlwy.net',
    'port': 27445,
    'user': 'root',
    'password': 'GzJtCAhdsjOItyzpajpisYXbEHJiajpD',
    'database': 'railway',
}

try:
    # Connect to database
    connection = pymysql.connect(**DB_CONFIG)
    cursor = connection.cursor()
    
    # Delete all records from django_migrations table
    print("Clearing migration records...")
    cursor.execute("DELETE FROM django_migrations")
    connection.commit()
    
    print("Migration records cleared successfully!")
    print("Now run: python manage.py migrate")
    
    cursor.close()
    connection.close()
    
except Exception as e:
    print(f"Error: {e}")
    print("\nTrying alternative method...")
    print("You may need to manually clear the django_migrations table or run:")
    print("python manage.py migrate --fake-initial")

