#from django.shortcuts import render
#import json
#from django.utils.safestring import mark_safe
#from django.contrib.auth.decorators import login_required


# Create your views here.
#def home(request):
#    return render(request, 'chats/home.html')

#@login_required
#def room(request, room_name):
#    return render(request, 'chats/room.html', {
#        'room_name_json': mark_safe(json.dumps(room_name)),
#        'username': mark_safe(json.dumps(request.user.username))
#        })

from django.shortcuts import get_object_or_404
from .models import Chat, Contact
from django.contrib.auth import get_user_model


User = get_user_model()

def get_last_30_messages(chatID):
    chat = get_object_or_404(Chat, id=chatID)
    return chat.messages.order_by('-timestamp').all()[:30]


def get_user_contact(username):
    user = get_object_or_404(User, username=username)
    return get_object_or_404(Contact, user=user)

def get_current_chat(chatId):
    return get_object_or_404(Chat, id=chatId)
