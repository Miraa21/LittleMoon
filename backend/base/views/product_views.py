from django.shortcuts import render
from rest_framework.decorators import api_view,permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from base.models import Product,Review
from base.serializers import ProductSerializer
from django.contrib.auth.hashers import make_password
from rest_framework import status
from django.db.models import Sum
from django.core.paginator import Paginator,EmptyPage,PageNotAnInteger
from django.views.generic import ListView
import boto3
from botocore.exceptions import NoCredentialsError, PartialCredentialsError
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile


@api_view(['GET'])
def getProducts(request):
    query = request.GET.get('keyword', '')
    products = Product.objects.filter(name__icontains=query)

    page = request.GET.get('page', 1)
    paginator = Paginator(products, 8)

    try:
        products = paginator.page(page)
    except PageNotAnInteger:
        products = paginator.page(1)
    except EmptyPage:
        products = paginator.page(paginator.num_pages)

    serializer=ProductSerializer(products,many=True)

    return Response({'products': serializer.data,
                     'page':page,
                     'pages':paginator.num_pages})
@api_view(['GET'])    
def getTopProducts(request):
    products=Product.objects.filter(rating__gte=4).order_by('-rating')[0:5]
    serializer=ProductSerializer(products,many=True)
    return Response(serializer.data)

@api_view(['GET'])
def getProduct(request,pk):
    product=Product.objects.get(_id=pk)
    serializer=ProductSerializer(product,many=False)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAdminUser])
def createProduct(request):
    user=request.user
    product=Product.objects.create(
        user=user,
        name='Product Name',
        price=0,
        stock=0,
        category='',
        description=''
    )
    serializer=ProductSerializer(product,many=False)
    return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([IsAdminUser])
def updateProduct(request,pk):
    data=request.data
    product=Product.objects.get(_id=pk)
    product.name=data['name']
    product.price=data['price']
    product.stock=data['stock']
    product.category=data['category']
    product.description=data['description']
    product.save()
    serializer=ProductSerializer(product,many=False)
    return Response(serializer.data)


@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def deleteProduct(request,pk):
    product=Product.objects.get(_id=pk)
    serializer=ProductSerializer(product,many=False)
    product.delete()
    return Response('Product Deleted')

@api_view(['POST'])
def uploadImage(request):
    data = request.data
    product_id = data.get('product_id')

    try:
        product = Product.objects.get(_id=product_id)
    except Product.DoesNotExist:
        return Response("Product not found", status=status.HTTP_404_NOT_FOUND)

    product.image = request.FILES.get('image')
    product.save()

    return Response('Image was uploaded successfully')

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createProductReview(request, pk):
    user = request.user
    product = Product.objects.get(_id=pk)
    data = request.data

    # Review already exists
    alreadyExists = product.review_set.filter(user=user).exists()
    if alreadyExists:
        content = {'detail': 'Product already reviewed'}
        return Response(content, status=status.HTTP_400_BAD_REQUEST)

    # No rating or 0 rating
    if 'rating' not in data or data['rating'] == '':
        content = {'detail': 'Please select a rating'}
        return Response(content, status=status.HTTP_400_BAD_REQUEST)

    # Highlighted: Ensure rating is converted to the appropriate type
    rating = float(data['rating'])

    # Create review
    review = Review.objects.create(
        user=user,
        product=product,
        name=user.first_name,
        rating=rating,
        comment=data['comment']
    )

    # Calculate total rating and update product numReviews and rating
    reviews = product.review_set.all()
    product.numReviews = len(reviews)
    total_rating = reviews.aggregate(Sum('rating'))['rating__sum']
    product.rating = total_rating / len(reviews)
    product.save()

    return Response('Review added!')
