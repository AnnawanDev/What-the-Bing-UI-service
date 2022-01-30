# Notes
## Starting / Stopping MySQL locally
```
mysql.server start
mysql.server stop
```


## setting up user
```
CREATE USER 'session-test'@'localhost' IDENTIFIED BY 'password';

GRANT ALL PRIVILEGES ON bingtest.* TO 'session-test'@'localhost';
```
