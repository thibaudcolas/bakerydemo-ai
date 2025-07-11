from django.forms import Media, TextInput, Textarea


class ContextualAltWidgetMixin:
    def __init__(
        self,
        *args,
        **kwargs,
    ):
        super().__init__(*args, **kwargs)

    def build_attrs(self, *args, **kwargs):
        attrs = super().build_attrs(*args, **kwargs)
        attrs["data-controller"] = "contextual-alt"
        return attrs

    @property
    def media(self):
        return Media(
            js=[
                "contextual-alt.js",
            ],
        )


class ContextualAltInputWidget(ContextualAltWidgetMixin, TextInput):
    pass



class ImageDescriptionWidgetMixin:
    def __init__(
        self,
        *args,
        **kwargs,
    ):
        super().__init__(*args, **kwargs)

    def build_attrs(self, *args, **kwargs):
        attrs = super().build_attrs(*args, **kwargs)
        attrs["data-controller"] = "image-description"
        return attrs

    @property
    def media(self):
        return Media(
            js=[
                "image-description.js",
            ],
        )


class ImageDescriptionWidget(ImageDescriptionWidgetMixin, TextInput):
    pass


class ImageDescriptionTextareaWidget(ImageDescriptionWidgetMixin, Textarea):
    def build_attrs(self, *args, **kwargs):
        attrs = super().build_attrs(*args, **kwargs)
        attrs["data-controller"] = "image-description"
        return attrs