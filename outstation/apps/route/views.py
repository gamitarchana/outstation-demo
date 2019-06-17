from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse, JsonResponse
from .models import OutstationRoutePage

def like_route(request):
    route = get_object_or_404(OutstationRoutePage, id = request.POST.get('route_id'))
    is_liked = False
    if(route.likes.filter(id = request.user.id)).exists():
        route.likes.remove(request.user)
        is_liked = False
    else:
        route.likes.add(request.user)
        is_liked = True
    count = route.likes.count()
    return JsonResponse({'likes_count':count, 'is_liked':is_liked})
