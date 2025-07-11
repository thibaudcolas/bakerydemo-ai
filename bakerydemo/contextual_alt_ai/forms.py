from functools import cached_property

from django import forms
from django.utils.translation import gettext_lazy as _
from wagtail.admin.staticfiles import versioned_static
from wagtail.images.forms import BaseImageForm
from bakerydemo.contextual_alt_ai.widgets import ImageDescriptionTextareaWidget

class DescribeImageForm(BaseImageForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.instance and self.instance.pk:
            self.fields["description"].widget = ImageDescriptionTextareaWidget()

    @cached_property
    def media(self):
        return super().media + forms.Media(
            js=[
                versioned_static("image_description.js"),
            ],
            css={
                "all": [versioned_static("image_description.css")],
            },
        )
