# Generated by Django 3.1.12 on 2024-12-12 15:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0002_auto_20241212_1543'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customuser',
            name='id',
            field=models.IntegerField(primary_key=True, serialize=False),
        ),
    ]
