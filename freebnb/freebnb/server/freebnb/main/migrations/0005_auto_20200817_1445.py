# Generated by Django 3.1 on 2020-08-17 14:45

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0004_auto_20200817_0015'),
    ]

    operations = [
        migrations.AlterField(
            model_name='listingphoto',
            name='image',
            field=models.ImageField(upload_to='listings/'),
        ),
        migrations.AlterField(
            model_name='listingphoto',
            name='listing',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='photos', related_query_name='photo', to='main.listing'),
        ),
        migrations.AlterField(
            model_name='message',
            name='conversation',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='messages', related_query_name='message', to='main.conversation'),
        ),
        migrations.AlterField(
            model_name='reservation',
            name='listing',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='listings', related_query_name='listing', to='main.listing'),
        ),
    ]
