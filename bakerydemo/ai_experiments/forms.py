from functools import cached_property

from django import forms
from django.utils.translation import gettext_lazy as _
from wagtail.admin.staticfiles import versioned_static
from wagtail.images.forms import BaseImageForm


class DescribeImageForm(BaseImageForm):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.instance and self.instance.pk:
            widget = self.fields["description"].widget
            widget.attrs["data-wagtailai-image-id"] = str(self.instance.pk)
            widget.attrs["data-wagtailai-button-title"] = _("Describe image using AI")
            widget.template_name = "wagtail_ai/widgets/image_title.html"

    @cached_property
    def media(self):
        return super().media + forms.Media(
            js=[
                versioned_static("wagtail_ai/image_description.js"),
            ],
            css={
                "all": [versioned_static("wagtail_ai/image_description.css")],
            },
        )
