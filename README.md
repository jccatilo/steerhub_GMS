# steerhub_GMS

Back end pre-requisites:
- python 3.12.4
- cd to /api and then create or edit **gms_configs.env** and make sure you have the ff:
```
DATABASE_URL = "mysql+pymysql://root:@localhost/steerhub_gms"
MAIL_USERNAME="##########@gmail.com" #emaling email
MAIL_PASSWORD="#########" #APP KEY, private
MAIL_FROM="########@gmail.com"#emaling email
MAIL_SERVER="smtp.gmail.com"
SECRET_KEY="wewoo" #APP SECRET KEY, private
URL_FRONT_END_APP="http://localhost"
PORT_FRONT_END_APP="8081"

```

Front end pre-requisites:
- node js
- cd to /front-end/src/ and create or edit **gms_config.hs** and make sure you have the ff:
```
export const CONFIG  = {
    API_URL: "http://localhost",
    API_PORT: "81",
    FRONT_END_URL:"http://localhost",
    FRONT_END_PORT: "8081",
    DEBUG_MODE: true,
    APP_VERSION: "1.0.0",
    OTHER_CONFIG: "value"
};
```


## Installing and running back-end
1. go to */api* directory and do **pip instsall -r requirements.txt**
2. **uvicorn main:app --host 0.0.0.0 --port 81**

## Running the front end
1. **npm install**
2. **npm start**

## STEERHUB GMS QR Code scanner, go to
1. *hostname* + : + *front end port* + /pages/gms-qr-verifier-app/index.html