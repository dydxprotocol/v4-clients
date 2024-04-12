from v4_client_py.clients.helpers.request_helpers import generate_query_path

def test_generate_query_path():
  query_path = generate_query_path('https://google.com', {'a': True, 'b': False, 'c': 'TEST'})
  assert query_path == 'https://google.com?a=true&b=false&c=TEST'
