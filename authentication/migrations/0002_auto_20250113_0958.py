# Generated by Django 3.1.12 on 2025-01-13 09:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0001_initial'),
    ]

    operations = [
        migrations.AddIndex(
            model_name='patient',
            index=models.Index(fields=['numero_identite'], name='authenticat_numero__b50103_idx'),
        ),
        migrations.AddIndex(
            model_name='patient',
            index=models.Index(fields=['nom'], name='authenticat_nom_af861b_idx'),
        ),
        migrations.AddIndex(
            model_name='patient',
            index=models.Index(fields=['prenom'], name='authenticat_prenom_841b87_idx'),
        ),
        migrations.AddIndex(
            model_name='patient',
            index=models.Index(fields=['sex'], name='authenticat_sex_255301_idx'),
        ),
    ]
