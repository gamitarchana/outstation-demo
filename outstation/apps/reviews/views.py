from django.shortcuts import render, get_object_or_404
from django.conf import settings
from django.core.files.storage import FileSystemStorage
from .models import Review, ReviewImage, ReviewVideo
from outstation.apps.route.models import OutstationRoutePage
from outstation.apps.auth.models import UserProfile
from django.http import HttpResponse, JsonResponse

from antispam import akismet

def review_list(request, route_id):
    if (route_id and route_id.strip and Review.objects.all().filter(route_id=route_id).exists()):
        reviews = Review.objects.all().filter(route_id=route_id).order_by('-publish_date')
        return render(request, 'reviews/review_list.html', {'reviews': reviews})
    return render(request, 'reviews/review_list.html',{'reviews':''})

def review(request):

    if request.method == 'POST':
        reviewTitle = request.POST.get('reviewTitle')
        reviewComments = request.POST.get('reviewComments')
        reviewRating = request.POST.get('reviewRating')
        user_profile = get_object_or_404(UserProfile, user_id=request.user.id)
        route_id = request.POST.get('route_id')
        data = {}

        if akismet.check(
            request=akismet.Request.from_django_request(request),
            comment=akismet.Comment(
                content=reviewTitle,
                type='comment',
                author=akismet.Author(
                    name=user_profile.user.username,
                    email=user_profile.user.email
                )
            )
        ):
            print('Title Spam detected')
            data['is_title_spam'] = True;
        if akismet.check(
            request=akismet.Request.from_django_request(request),
            comment=akismet.Comment(
                content=reviewComments,
                type='comment',
                author=akismet.Author(
                    name=user_profile.user.username,
                    email=user_profile.user.email
                )
            )
        ):
            data['is_comment_spam'] = True;

        if data:
            return JsonResponse(data)
        if not data:
            route = get_object_or_404(OutstationRoutePage, id=request.POST.get('route_id'))
            user_review = Review.objects.create(
                title = reviewTitle,
                review_comments = reviewComments,
                rating = reviewRating,
                user_profile = user_profile,
                route = route
            )
            for key in request.FILES:
                if 'images' in key:
                    image_file = request.FILES[key]
                    ReviewImage.objects.create(image=image_file, review=user_review)
                if 'videos' in key:
                    video_file = request.FILES[key]
                    ReviewVideo.objects.create(video=video_file, review=user_review)
            count=route.page_review.count()
            reviews = Review.objects.all().filter(route_id=route_id).order_by('-publish_date')
            #return render(request, 'reviews/review_list.html', {'reviews': reviews, 'count':count})
            return JsonResponse({'total_reviews':count})
            #return render(request, 'reviews/review_list.html', reviews)
    """if request.method == 'POST':
        route = get_object_or_404(OutstationRoutePage, id=request.POST.get('route_id'))
        user_profile = get_object_or_404(UserProfile, user_id=request.user.id)
        user_review = Review.objects.create(
            title = reviewTitle,
            review_comments = reviewComments,
            rating = reviewRating,
            user_profile = user_profile,
            route = route
        )
        for key in request.FILES:
            if 'images' in key:
                image_file = request.FILES[key]
                ReviewImage.objects.create(image=image_file, review=user_review)
            if 'videos' in key:
                video_file = request.FILES[key]
                ReviewVideo.objects.create(video=video_file, review=user_review)
        count=route.page_review.count()
        return JsonResponse({'total_reviews':count})"""

    return render(request, 'reviews/review.html')
