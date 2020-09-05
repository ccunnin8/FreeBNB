from channels.consumer import AsyncConsumer
from channels.exceptions import StopConsumer
from rest_framework_jwt.authentication import jwt_get_username_from_payload, jwt_decode_handler
import json 

class ChatConsumer(AsyncConsumer):

    async def websocket_connect(self, event):
        # get token from query string by converting byte -> string -> parse
        query_string = self.scope["query_string"].decode("utf8")
        token = query_string.split("=")[1]
        # if we successful get a user add to self.user
        # store conversation id in self.conversation_id 
        if token:
            payload = jwt_decode_handler(token)
            user = jwt_get_username_from_payload(payload)
            self.user = user 
        if user:
            await self.send({
                "type": "websocket.accept"
            })
        else:
            await self.send({
                "type": "websocket.close"
            })
    
    async def websocket_receive(self, event):
        await self.send({
            "type": "websocket.send",
            "text": event["text"]
        })
    
    async def websocket_disconnect(self, event):
        print("disconnected")
        await self.send({
            "type": "websocket.close"
        })
        raise StopConsumer()
    
    
        