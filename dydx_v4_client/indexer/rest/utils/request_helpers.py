from typing import Any, Dict


def generate_query_path(url: str, params: Dict[str, Any]) -> str:
    """
    Generate the query path by appending the provided parameters to the given URL.

    Args:
        url (str): The base URL.
        params (Dict[str, Any]): A dictionary of query parameters.

    Returns:
        str: The URL with the query parameters appended.
    """
    defined_entries = [
        (key, value) for key, value in params.items() if value is not None
    ]

    if not defined_entries:
        return url

    params_string = "&".join(f"{key}={value}" for key, value in defined_entries)
    return f"{url}?{params_string}"
