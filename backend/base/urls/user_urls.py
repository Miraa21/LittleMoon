#connect views to url
from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView
)
from base.views import user_views as views

urlpatterns = [
    path('login/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('register/',views.registerUser,name='register'),
    path('profile/',views.getUserProfile,name="users-profile"),
    path('profile/update/',views.updateUserProfile,name="user-profile-update"),
    path('',views.getUsers,name="users"),
    path('delete/<str:pk>/',views.deleteUser,name='user-delete'),
    path('update/<str:pk>/',views.updateUser,name='user-update'),
    path('<str:pk>/',views.getUserById,name='user'),
    
]
