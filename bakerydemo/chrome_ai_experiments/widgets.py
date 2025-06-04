from django.forms import Media, TextInput, Textarea
from wagtail.admin.widgets import AdminAutoHeightTextInput


class TextSummarizeWidgetMixin:
    def __init__(
        self,
        summarization_type="headline",
        length="short",
        shared_context=None,
        *args,
        **kwargs,
    ):
        self.summarization_type = summarization_type
        self.length = length
        self.shared_context = shared_context
        super().__init__(*args, **kwargs)

    def build_attrs(self, *args, **kwargs):
        attrs = super().build_attrs(*args, **kwargs)
        attrs["data-controller"] = "text-summarize"
        attrs["data-text-summarize-type-value"] = self.summarization_type
        attrs["data-text-summarize-length-value"] = self.length
        if self.shared_context:
            attrs["data-text-summarize-shared-context-value"] = self.shared_context
        return attrs

    @property
    def media(self):
        return Media(
            js=[
                "text-summarize.js",
            ],
        )


class TextSummarizeInputWidget(TextSummarizeWidgetMixin, TextInput):
    pass


class TextSummarizeTextareaWidget(TextSummarizeWidgetMixin, AdminAutoHeightTextInput):
    def build_attrs(self, *args, **kwargs):
        attrs = super().build_attrs(*args, **kwargs)
        attrs["data-controller"] = "text-summarize w-autosize"
        return attrs
