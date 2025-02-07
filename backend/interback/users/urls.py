from django.urls import path
from .views import SignUpView
from .views import LoginView
from .views import ForgotPasswordView


urlpatterns = [
    path('signup/', SignUpView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('forgot_password/', ForgotPasswordView.as_view(), name='forgot_password'),
]
