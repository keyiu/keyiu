# 生成签名ECDSA密钥对的方法
```
openssl ecparam -name secp256k1 -genkey -out privateKey.pem
openssl ec -in privateKey.pem -pubout -out publiceKey.pem
```