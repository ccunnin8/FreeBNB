# Generated by Django 3.1 on 2020-09-09 10:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0015_auto_20200905_0030'),
    ]

    operations = [
        migrations.AddField(
            model_name='message',
            name='time',
            field=models.TextField(default='', max_length=15),
        ),
    ]