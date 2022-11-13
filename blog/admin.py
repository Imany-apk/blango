from django.contrib import admin

from blog.models import Tag, Post

admin.site.register(Tag)

class PostAdmin(admin.ModelAdmin):
    prepopulated_fields = {"slug": ("title",)}
    # exclude = ["slug"]
    # fields = ["title"]
    list_display = ["title", "slug", "published_at"]
    
    # There are many more options that can be used, and the full list can be viewed at the:
    # (Django Model Admin Options Documenatation)[https://docs.djangoproject.com/en/3.2/ref/contrib/admin/#modeladmin-options]

admin.site.register(Post, PostAdmin)