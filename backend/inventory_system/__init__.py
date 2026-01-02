# This file makes Python treat the directory as a package

# Configure PyMySQL to work with Django
import pymysql

# Tell PyMySQL to act like MySQLdb (the MySQL driver Django expects)
pymysql.install_as_MySQLdb()

