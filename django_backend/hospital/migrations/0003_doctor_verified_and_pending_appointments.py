# Generated migration: Doctor.is_verified and Appointment Pending status

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('hospital', '0002_role_medication_and_bill_links'),
    ]

    operations = [
        migrations.AddField(
            model_name='doctor',
            name='is_verified',
            field=models.BooleanField(default=False, help_text='Admin must verify for doctor to appear to patients'),
        ),
        migrations.AlterField(
            model_name='appointment',
            name='status',
            field=models.CharField(
                choices=[
                    ('Pending', 'Pending'),
                    ('Scheduled', 'Scheduled'),
                    ('Completed', 'Completed'),
                    ('Cancelled', 'Cancelled'),
                ],
                default='Pending',
                max_length=20,
            ),
        ),
    ]
