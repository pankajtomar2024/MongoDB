# Pankaj Tomar

SERVER :- localhost:8000/getAllStudents or http://localhost:8000/getAllStudents

# What keyword means

socket means particular user
io meeans entire socket

# connection

event name "connection" in server side
event name "connect" in client side

event name "disconnect" in server side
event name "disconnect" in client side

# Trigger

io.emit ——— trigger an event for every user and sent data ( from server side )
socket.On ——— listen an event for every user and receive data ( from client side )
socket.braodcast.emit ——— every user will receive data , rather then who requested will not receive data
