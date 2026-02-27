from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .chatbot_service import ChatbotService
from .models import ChatHistory

class ChatbotView(APIView):
    def post(self, request):
        user_message = request.data.get('message', '')
        if not user_message:
            return Response({"error": "Message is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        history = request.data.get('history') or []
        # Ensure history is a list of {sender, text}
        if not isinstance(history, list):
            history = []
        bot_response = ChatbotService.get_response(user_message, history=history)
        
        # Save to history
        ChatHistory.objects.create(
            user_message=user_message,
            bot_response=bot_response
        )
        
        return Response({"response": bot_response}, status=status.HTTP_200_OK)
