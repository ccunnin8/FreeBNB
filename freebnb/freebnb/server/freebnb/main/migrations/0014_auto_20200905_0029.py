# Generated by Django 3.1 on 2020-09-05 00:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0013_reservation_accepted'),
    ]

    operations = [
        migrations.AlterField(
            model_name='conversation',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True),
        ),
    ]
