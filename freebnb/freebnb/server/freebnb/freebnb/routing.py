from django.urls import path 
from channels.routing import ProtocolTypeRouter, URLRouter 
from channels.auth import AuthMiddlewareStack 
from main.consumers import ChatConsumer

chat = ProtocolTypeRouter({
    "websocket": AuthMiddlewareStack(
        URLRouter([
            path("messages/<int:conversation_id>", ChatConsumer)
        ])
    )
}) 