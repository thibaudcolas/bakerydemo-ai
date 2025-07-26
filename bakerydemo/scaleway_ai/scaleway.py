from typing import Any

import requests
from django.conf import settings
from wagtail_ai.ai.openai import OpenAIBackend, OpenAIResponse


class ScalewayAIBackend(OpenAIBackend):
    """
    Custom backend for Scaleway AI, using the OpenAIBackend as a base.
    This backend is configured to use the Mistral model hosted on Scaleway.
    """

    def chat_completions(self, messages: list[dict[str, Any]]) -> OpenAIResponse:
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.get_openai_api_key()}",
        }
        new_messages = []
        print(messages)
        for m in messages:
            if (
                isinstance(m["content"], list)
                and m["content"][0]["type"] == "text"
                and len(m["content"]) < 1
            ):
                m["content"] = " ".join([mm["text"] for mm in m["content"]])
            new_messages.append(m)
        payload = {
            "model": self.config.model_id,
            "messages": new_messages,
            "max_tokens": self.config.token_limit,
        }
        try:
            response = requests.post(
                settings.SCALEWAY_AI_URL,
                headers=headers,
                json=payload,
                timeout=self.config.timeout_seconds,
            )

            response.raise_for_status()
        except requests.RequestException as e:
            raise ValueError(f"Failed to connect to Scaleway AI: {e}")

        return OpenAIResponse(response)
