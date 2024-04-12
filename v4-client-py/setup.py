from setuptools import setup, find_packages

LONG_DESCRIPTION = open('README.md', 'r').read()

REQUIREMENTS = [
    'aiohttp>=3.8.1',
    'cytoolz==0.12.1',
    'dateparser==1.0.0',
    'dydx>=0.1',
    'ecdsa>=0.16.0',
    'eth_keys',
    'eth-account>=0.4.0,<0.6.0',
    'mpmath==1.0.0',
    'requests>=2.22.0,<3.0.0',
    'sympy==1.6',
    'web3>=5.0.0,<6.0.0',
]

setup(
    name='dydx-v4-python',
    version='0.1',
    packages=find_packages(),
    package_data={
    },
    description='dYdX v4 Python Client',
    long_description=LONG_DESCRIPTION,
    long_description_content_type='text/markdown',
    url='https://github.com/dydxprotocol/v4-client-py',
    author='dYdX Trading Inc.',
    license='BSL-1.1',
    license_files = ("LICENSE"),
    author_email='contact@dydx.exchange',
    install_requires=REQUIREMENTS,
    keywords='dydx exchange rest api defi ethereum eth cosmo',
    classifiers=[
        'Intended Audience :: Developers',
        'License :: OSI Approved :: Apache Software License',
        'Operating System :: OS Independent',
        'Programming Language :: Python :: 3.9',
        'Programming Language :: Python :: 3.11',
        'Programming Language :: Python',
        'Topic :: Software Development :: Libraries :: Python Modules',
    ],
)
