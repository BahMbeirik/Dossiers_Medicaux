# Generated by Django 3.1.12 on 2025-01-13 10:04

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0002_auto_20250113_0958'),
    ]

    operations = [
        migrations.RemoveIndex(
            model_name='patient',
            name='authenticat_numero__b50103_idx',
        ),
        migrations.RemoveIndex(
            model_name='patient',
            name='authenticat_nom_af861b_idx',
        ),
        migrations.RemoveIndex(
            model_name='patient',
            name='authenticat_prenom_841b87_idx',
        ),
        migrations.RemoveIndex(
            model_name='patient',
            name='authenticat_sex_255301_idx',
        ),
    ]
