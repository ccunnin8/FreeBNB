# Generated by Django 3.1 on 2020-08-26 09:55

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0009_auto_20200826_0945'),
    ]

    operations = [
        migrations.AlterField(
            model_name='rules',
            name='listing',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='rules', related_query_name='rules', to='main.listing'),
        ),
    ]
