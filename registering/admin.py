
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser  # Replace with the actual path to your custom User model

class CustomUserAdmin(UserAdmin):
    # Specify the fields you want to display in the admin interface
    model = CustomUser
    list_display = ['username', 'email', 'firstname', 'lastname', 'is_active', 'is_admin']
    list_filter = ['is_active', 'is_admin']
    search_fields = ['username', 'email', 'firstname', 'lastname']
    ordering = ['username']
    fieldsets = (
        (None, {'fields': ('username', 'email', 'password')}),
        ('Personal info', {'fields': ('firstname', 'lastname')}),
        ('Permissions', {'fields': ('is_active', 'is_admin')}),
        ('Important dates', {'fields': ('date_joined',)}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'password1', 'password2')}
        ),
    )

# Register the custom User model with the custom UserAdmin
admin.site.register(CustomUser, CustomUserAdmin)
