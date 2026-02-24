from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'patients', views.PatientViewSet, basename='patients')
router.register(r'doctors', views.DoctorViewSet, basename='doctors')
router.register(r'appointments', views.AppointmentViewSet, basename='appointments')
router.register(r'treatments', views.TreatmentViewSet, basename='treatments')
router.register(r'medications', views.MedicationViewSet, basename='medications')
router.register(r'bills', views.BillViewSet, basename='bills')

urlpatterns = [
    path('', include(router.urls)),
    path('auth/csrf/', views.csrf_view, name='auth-csrf'),
    path('auth/login/', views.login_view, name='auth-login'),
    path('auth/register/', views.register_view, name='auth-register'),
    path('auth/logout/', views.logout_view, name='auth-logout'),
    path('auth/me/', views.me_view, name='auth-me'),
    path('doctors/recommended/', views.recommended_doctors, name='recommended-doctors'),
    path('dashboard/stats/', views.dashboard_stats, name='dashboard-stats'),
]
