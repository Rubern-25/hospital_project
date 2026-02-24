from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('hospital', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='UserProfile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('role', models.CharField(choices=[('Admin', 'Admin'), ('Doctor', 'Doctor'), ('Patient', 'Patient')], max_length=20)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('doctor', models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='user_profile', to='hospital.doctor')),
                ('patient', models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='user_profile', to='hospital.patient')),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='profile', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Medication',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('medication_name', models.CharField(max_length=150)),
                ('dosage', models.CharField(max_length=120)),
                ('frequency', models.CharField(help_text='e.g. 1 tablet daily', max_length=120)),
                ('time_of_day', models.CharField(choices=[('Morning', 'Morning'), ('Afternoon', 'Afternoon'), ('Evening', 'Evening'), ('Night', 'Night')], max_length=20)),
                ('instructions', models.TextField(blank=True, null=True)),
                ('start_date', models.DateField()),
                ('end_date', models.DateField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('doctor', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='medications', to='hospital.doctor')),
                ('patient', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='medications', to='hospital.patient')),
                ('treatment', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='medications', to='hospital.treatment')),
            ],
            options={
                'ordering': ['time_of_day', '-created_at'],
            },
        ),
        migrations.AddField(
            model_name='bill',
            name='doctor',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='bills', to='hospital.doctor'),
        ),
        migrations.AddField(
            model_name='bill',
            name='treatment',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='bills', to='hospital.treatment'),
        ),
    ]
