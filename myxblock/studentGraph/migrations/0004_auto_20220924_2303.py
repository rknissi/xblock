# Generated by Django 2.2.20 on 2022-09-24 23:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('studentGraph', '0003_auto_20220901_0154'),
    ]

    operations = [
        migrations.AddField(
            model_name='resolution',
            name='edgeIdList',
            field=models.TextField(default=''),
        ),
        migrations.AlterField(
            model_name='resolution',
            name='nodeIdList',
            field=models.TextField(default=''),
        ),
    ]
