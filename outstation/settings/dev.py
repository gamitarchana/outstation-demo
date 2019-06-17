from .base import *

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = '7@-qr1ld5e44q@m@!zegp#6dzfak9)yuua#p0md4@v#n$o*&-x'

# SECURITY WARNING: define the correct hosts in production!
ALLOWED_HOSTS = ['localhost']

ADMINS = [('Archana', 'gamit.archana.n@gmail.com')]
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

EMAIL_HOST = 'smtp.gmail.com'
EMAIL_USE_TLS = True
EMAIL_PORT = 587
EMAIL_HOST_USER = 'gamit.archana.n@gmail.com'
EMAIL_HOST_PASSWORD = 'm18d31a23n1'

DEFAULT_FROM_EMAIL = 'gamit.archana.n@gmail.com'

SERVER_EMAIL = 'gamit.archana.n@gmail.com'

try:
    from .local import *
except ImportError:
    pass
