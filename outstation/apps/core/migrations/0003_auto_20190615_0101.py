# Generated by Django 2.0.13 on 2019-06-14 19:31

from django.db import migrations, models
import outstation.apps.core.enums


class Migration(migrations.Migration):

    dependencies = [
        ('outstationcore', '0002_auto_20190614_1736'),
    ]

    operations = [
        migrations.AlterField(
            model_name='faretable',
            name='per_km_rate',
            field=models.PositiveSmallIntegerField(default=0, verbose_name='Per km rate (₹)'),
        ),
        migrations.AlterField(
            model_name='faretable',
            name='vehicle_feature',
            field=models.CharField(choices=[(outstation.apps.core.enums.VehicleFeatureChoice('AC'), 'AC'), (outstation.apps.core.enums.VehicleFeatureChoice('Non AC'), 'Non AC')], default=outstation.apps.core.enums.VehicleFeatureChoice('AC'), max_length=6),
        ),
        migrations.AlterField(
            model_name='place',
            name='duration_of_visit',
            field=models.DurationField(default='00:05:00', help_text='[DD] [HH:[MM:]]ss[.uuuuuu] format', verbose_name='Duration Of Visit (HH:MM:SS)'),
        ),
    ]
