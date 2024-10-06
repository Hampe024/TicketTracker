# TicketTracker

## Setup

### MongoDB
Have mongoDB installed locally and running on port 27017
```
mongosh --port 27017
sudo systemctl start mongod
```

### Ngrok
Have ngrok installed locally and running using domain martin-flexible-terminally.ngrok-free.app
```
ngrok http --url martin-flexible-terminally.ngrok-free.app 3000
```

## Startup

### Backend
In /backend
```
node index
```

### Frontend
In /frontend
```
npm run run
```