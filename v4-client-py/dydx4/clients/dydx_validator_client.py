
import grpc

from .modules.get import Get
from .modules.post import Post
from .constants import ValidatorConfig

class ValidatorClient:
    def __init__(
        self,
        config: ValidatorConfig,
        credentials = grpc.ssl_channel_credentials(),
    ):
        self._get = Get(config, credentials)
        self._post = Post(config)

    @property
    def get(self) -> Get:
        '''
        Get the public module, used for retrieving on-chain data.
        '''
        return self._get

    @property
    def post(self) -> Post:
        '''
        Get the Post module, used for sending transactions
        '''
        return self._post
    
        
        
