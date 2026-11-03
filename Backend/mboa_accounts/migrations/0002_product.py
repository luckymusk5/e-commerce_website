from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ('mboa_accounts', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Product',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=180)),
                ('slug', models.SlugField(max_length=200, unique=True)),
                ('category', models.CharField(max_length=100)),
                ('description', models.TextField(blank=True)),
                ('features', models.JSONField(blank=True, default=list)),
                ('price', models.DecimalField(decimal_places=2, max_digits=12)),
                ('old_price', models.DecimalField(blank=True, decimal_places=2, max_digits=12, null=True)),
                ('currency', models.CharField(default='XAF', max_length=3)),
                ('stock', models.PositiveIntegerField(default=0)),
                ('badge', models.CharField(blank=True, max_length=40)),
                ('image_url', models.URLField(blank=True, max_length=500)),
                ('is_active', models.BooleanField(default=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={'ordering': ['-created_at']},
        ),
    ]