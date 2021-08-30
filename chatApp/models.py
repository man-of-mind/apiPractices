from django.contrib.auth import get_user_model
from django.db import models

# Create your models here.

User = get_user_model()

class Contact(models.Model):
    user = models.ForeignKey(User, related_name="friends", on_delete=models.CASCADE)
    friends = models.ManyToManyField('self', blank=True)

    def __str__(self):
        return self.user.username


class Message(models.Model):
    contact = models.ForeignKey(Contact, related_name='author_messages', on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return self.contact.user.username


class Chat(models.Model):
    participants = models.ManyToManyField(Contact, related_name="chats")
    messages = models.ManyToManyField(Message, blank=True)

    
    def get_last_30_messages(self):
        return self.messages.objects.order_by('-timestamp').all()[:30]

    def __str__(self):
        return "{}".format(self.pk)