from channels.consumer import AsyncConsumer
from channels.db import database_sync_to_async
from channels.exceptions import StopConsumer
from rest_framework_jwt.authentication import jwt_get_username_from_payload, jwt_decode_handler
import json 
from .models import Conversation, Message, User 

class ChatConsumer(AsyncConsumer):

    async def websocket_connect(self, event):
        # get token from query string by converting byte -> string -> parse
        query_string = self.scope["query_string"].decode("utf8")
        token = query_string.split("=")[1]
        self.conversation_id = self.scope["url_route"]["kwargs"]["conversation_id"]
        # if we successful get a user add to self.user
        # store conversation id in self.conversation_id 
        if token:
            payload = jwt_decode_handler(token)
            user = jwt_get_username_from_payload(payload)
            self.user = user 
            self.room_name = f"conversation_{self.conversation_id}"
            await self.secure_conversation(self.conversation_id, self.user)
        if user:
            await self.channel_layer.group_add(
                self.room_name,
                self.channel_name,
            )
            await self.send({
                "type": "websocket.accept"
            })
        else:
            await self.send({
                "type": "websocket.close"
            })
    
    async def chat_message(self, event):
        await self.send({
            "type": "websocket.send",
            "text": event["text"],
        })
        await self.save_message(event["text"])
        

    async def websocket_receive(self, event):
        await self.channel_layer.group_send(
            self.room_name,
            {
                "type": "chat_message",
                "text": event["text"]
            }
        )
    
    async def websocket_disconnect(self, event):
        print("disconnected")
        await self.send({
            "type": "websocket.close"
        })
        raise StopConsumer()
    
    @database_sync_to_async
    def secure_conversation(self, conversation_id, user):
        """
        make sure user is either reciever or sender recorded in this conversation 
        """
        convo = Conversation.objects.filter(id=conversation_id)[0]
        if convo.receiver != user or convo.sender != user:
            return self.send({
                "type": "websocket.close"
            })

    @database_sync_to_async
    def save_message(self, message):
        user = User.objects.get(username=self.user)
        convo = Conversation.objects.get(id=self.conversation_id)
        return Message.objects.create(message=message, sender=user, conversation=convo)