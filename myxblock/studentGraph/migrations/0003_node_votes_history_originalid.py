# Generated by Django 2.2.20 on 2023-10-14 18:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('studentGraph', '0002_edge_votes_edge_votes_history_node_votes_node_votes_history'),
    ]

    operations = [
        migrations.AddField(
            model_name='node_votes_history',
            name='originalId',
            field=models.IntegerField(blank=True, default=None, null=True),
        ),
    ]
