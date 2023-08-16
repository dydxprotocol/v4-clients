
"""Common types."""

from typing import Any, Dict, List, Optional, Union

Primitive = Union[str, int, bool, float]
_JSONDict = Dict[Any, Any]  # temporary placeholder
_JSONList = List[Any]  # temporary placeholder
_JSONType = Optional[Union[Primitive, _JSONDict, _JSONList]]
# Added Dict[str, _JSONDict] as workaround to not properly resolving recursive types - _JSONDict should be subset of _JSONType
JSONLike = Union[Dict[str, _JSONType], Dict[str, _JSONDict]]
